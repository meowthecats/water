import fs from 'fs';

async function getMarylandWaterImages() {
  let urls = new Set();
  const queries = ["Maryland river", "Maryland creek", "Maryland lake", "Maryland stream", "Maryland pond"];
  for (const q of queries) {
      console.log("Querying", q);
      let searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url`;
      let res = await fetch(searchUrl, { headers: { 'User-Agent': 'MarylandApp/2.0' } });
      let data = await res.json();
      if (data && data.query && data.query.pages) {
          for (const key in data.query.pages) {
              const urlRaw = data.query.pages[key].imageinfo[0].url;
              const url = urlRaw.split('?')[0]; // Strip query param
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
  fs.writeFileSync('src/md_water_pool.json', JSON.stringify(Array.from(urls), null, 2), 'utf8');
  console.log("Saved", urls.size, "images to src/md_water_pool.json");
}

getMarylandWaterImages();
