import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const CACHE_FILE = path.resolve(process.cwd(), 'scripts/rss_cache.xml');

export async function GET() {
  console.log('✅ /rss.xml route HIT');
  let rssContent = '';
  let fetchDate = new Date().toISOString();

  try {
    const { runRSSFetcher } = require('../../scripts/fetchRSS');
    rssContent = await runRSSFetcher();

    const datedFeed = `<!-- Fetched on ${fetchDate} -->\n${rssContent}`;
    await writeFile(CACHE_FILE, datedFeed, 'utf-8');

    return new NextResponse(datedFeed, {
      headers: { 'Content-Type': 'application/rss+xml' },
    });
  } catch (error) {
    console.error('⚠️ RSS fetch failed:', error);

    if (existsSync(CACHE_FILE)) {
      const fallback = await readFile(CACHE_FILE, 'utf-8');
      return new NextResponse(fallback, {
        headers: { 'Content-Type': 'application/rss+xml' },
      });
    }

    return new NextResponse('RSS feed not available.', { status: 500 });
  }
}
