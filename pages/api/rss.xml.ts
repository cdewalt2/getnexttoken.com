import type { NextApiRequest, NextApiResponse } from "next";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Define the path to the cache file
const CACHE_FILE = path.resolve(process.cwd(), "scripts/rss_cache.xml");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("✅ API route hit: /api/rss.xml");

  const fetchDate = new Date().toISOString();
  let rssContent = "";

  try {
    console.log("🔄 Attempting to dynamically import fetchRSS...");
    const { runRSSFetcher } = require("../../scripts/fetchRSS");
    console.log("✅ fetchRSS imported successfully");

    console.log("🔄 Calling fetchRSS...");
    rssContent = await runRSSFetcher();
    console.log("✅ fetchRSS returned content, length:", rssContent?.length);

    const datedFeed = `<!-- Fetched on ${fetchDate} -->\n${rssContent}`;

    try {
      await writeFile(CACHE_FILE, datedFeed, "utf-8");
      console.log("📝 RSS feed written to cache:", CACHE_FILE);
    } catch (cacheErr) {
      console.warn("⚠️ Failed to write cache file:", cacheErr);
    }

    res.setHeader("Content-Type", "application/rss+xml");
    res.status(200).send(datedFeed);

  } catch (error) {
    console.error("❌ RSS fetch failed:", error);

    if (existsSync(CACHE_FILE)) {
      try {
        console.log("📦 Serving cached RSS feed from:", CACHE_FILE);
        const fallback = await readFile(CACHE_FILE, "utf-8");
        res.setHeader("Content-Type", "application/rss+xml");
        res.status(200).send(fallback);
      } catch (fallbackErr) {
        console.error("❌ Failed to read from cache:", fallbackErr);
        res.status(500).send("RSS feed not available (cache read error).");
      }
    } else {
      console.log("🚫 No RSS feed available in cache.");
      res.status(500).send("RSS feed not available.");
    }
  }
}
