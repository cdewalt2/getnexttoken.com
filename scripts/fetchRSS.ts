const { execSync } = require("child_process");
const { XMLParser } = require("fast-xml-parser");
const axios = require("axios");

const parser = new XMLParser();

type RSSArticle = {
  title: string;
  link: string;
  description: string;
  publishedDate: string;
};

const rssSources = [
  { name: "NYTimes Tech", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" },
  { name: "Wired", url: "https://www.wired.com/feed/rss" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
  { name: "ZDNet", url: "https://www.zdnet.com/news/rss.xml" },
];

async function runRSSFetcher(): Promise<string> {
  let combinedFeed: string[] = [];

  for (const source of rssSources) {
    try {
      console.log(`🌐 Fetching (via curl): ${source.url}`);
      const xml = execSync(`curl -s "${source.url}"`).toString();
      const json = parser.parse(xml);
      const items = json.rss?.channel?.item || [];

      const articles = items.slice(0, 3).map((item: any): RSSArticle => ({
        title: item.title,
        link: item.link,
        description: item.description || item["content:encoded"] || "",
        publishedDate: item.pubDate || "",
      }));

      await axios.post("https://getnexttoken.com/api/rss_feeds", {
        sourceName: source.name,
        sourceURL: source.url,
        articles,
      });

      combinedFeed.push(`<!-- ${source.name} -->`);
      for (const article of articles) {
        combinedFeed.push(`
<item>
  <title><![CDATA[${article.title}]]></title>
  <link>${article.link}</link>
  <description><![CDATA[${article.description}]]></description>
  <pubDate>${article.publishedDate}</pubDate>
</item>`);
      }

      console.log(`✅ Fetched and pushed articles from ${source.name}`);
    } catch (err: any) {
      console.error(`❌ Failed to fetch ${source.name}:`, err.message || err);
    }
  }

  const fullRSS = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>GetNextToken Combined Feed</title>
    <link>https://getnexttoken.com</link>
    <description>A combined feed of tech sources</description>
    ${combinedFeed.join("\n")}
  </channel>
</rss>`;

  return fullRSS;
}

module.exports = { runRSSFetcher };
