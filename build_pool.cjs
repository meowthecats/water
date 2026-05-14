const fs = require("fs");
const https = require("https");

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    let req = https.get(url, { headers: { 'User-Agent': 'MarylandApp/v2.0 (test@example.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
      });
    });
    req.on('error', reject);
  });
}

async function getMarylandWaterImages() {
  let urls = new Set();
  const queries = ["Maryland river", "Maryland creek", "Maryland lake", "Maryland stream", "Maryland pond"];
  for (const q of queries) {
      console.log("Querying", q);
      let searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url`;
      let data = await fetchJson(searchUrl);
      if (data && data.query && data.query.pages) {
          for (const key in data.query.pages) {
              const url = data.query.pages[key].imageinfo[0].url;
              const title = data.query.pages[key].title.toLowerCase();
              if (url.match(/\.(jpg|jpeg|png)$/i) && 
                 !title.includes('map') && !title.includes('logo') && !title.includes('diagram') &&
                 !title.includes('document') && !title.includes('sign') && !title.includes('school') &&
                 !title.includes('bridge') && !title.includes('plate') && !title.includes('text') &&
                 !title.includes('station') && !title.includes('route') && !title.includes('highway') &&
                 !title.includes('church') && !title.includes('house') && !title.includes('mansion') &&
                 !title.includes('portrait')) {
                  urls.add(url);
              }
          }
      }
  }
  fs.writeFileSync('md_water_pool.json', JSON.stringify(Array.from(urls), null, 2), 'utf8');
  console.log("Saved", urls.size, "images to md_water_pool.json");
}

getMarylandWaterImages();
