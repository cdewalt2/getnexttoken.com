#!/bin/bash

# Make sure curl and xmllint are installed
command -v curl >/dev/null || { echo "curl not installed"; exit 1; }
command -v xmllint >/dev/null || { echo "xmllint not installed (apt install libxml2-utils)"; exit 1; }

feeds=(
  "NYTimes Tech|https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
  "Wired|https://www.wired.com/feed/rss"
  "The Verge|https://www.theverge.com/rss/index.xml"
  "Ars Technica|https://feeds.arstechnica.com/arstechnica/index"
  "ZDNet|https://www.zdnet.com/news/rss.xml"
)

for feed in "${feeds[@]}"; do
  name="${feed%%|*}"
  url="${feed##*|}"

  echo "🌐 Fetching $name..."

  xml=$(curl -s "$url")
  [ -z "$xml" ] && echo "❌ No data from $url" && continue

  articles_json="[]"
  for i in {1..3}; do
    title=$(echo "$xml" | xmllint --xpath "string((//item)[${i}]/title)" - 2>/dev/null)
    link=$(echo "$xml" | xmllint --xpath "string((//item)[${i}]/link)" - 2>/dev/null)
    desc=$(echo "$xml" | xmllint --xpath "string((//item)[${i}]/description)" - 2>/dev/null)
    pub=$(echo "$xml" | xmllint --xpath "string((//item)[${i}]/pubDate)" - 2>/dev/null)

    if [ -n "$title" ]; then
      articles_json=$(echo "$articles_json" | jq --arg t "$title" --arg l "$link" --arg d "$desc" --arg p "$pub" \
        '. + [{title: $t, link: $l, description: $d, publishedDate: $p}]')
    fi
  done

  # Post to your CMS API
  echo "📤 Posting $name articles to CMS..."
  curl -s -X POST https://getnexttoken.com/api/rss_feeds \
    -H "Content-Type: application/json" \
    -d "{\"sourceName\":\"$name\",\"sourceURL\":\"$url\",\"articles\":$articles_json}"
done
