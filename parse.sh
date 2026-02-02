#!/bin/bash
# Extract episodes from RSS
grep -o '<item>.*</item>' rss.xml | while read -r item; do
  title=$(echo "$item" | sed -n 's/.*<title><!\[CDATA\[\(.*\)\]\]><\/title>.*/\1/p')
  echo "$title"
done | head -20
