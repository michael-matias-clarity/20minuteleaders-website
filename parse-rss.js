const https = require('https');
const { parseString } = require('xml2js');

https.get('https://anchor.fm/s/ce59eb28/podcast/rss', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Simple extraction without xml2js
    const episodes = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(data)) !== null && episodes.length < 1200) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
      const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const duration = item.match(/<itunes:duration>(.*?)<\/itunes:duration>/)?.[1] || '';
      const image = item.match(/<itunes:image href="(.*?)"/)?.[1] || '';
      const episode = item.match(/<itunes:episode>(\d+)<\/itunes:episode>/)?.[1] || '';
      
      // Extract guest name from title (usually after "Ep####: Name: Topic")
      const guestMatch = title.match(/Ep\d+[:|]\s*([^:]+)/);
      const guest = guestMatch ? guestMatch[1].trim() : '';
      
      episodes.push({ episode, title, guest, desc: desc.replace(/<[^>]+>/g, '').substring(0, 300), link, date, duration, image });
    }
    console.log(JSON.stringify(episodes, null, 2));
  });
}).on('error', console.error);
