const https = require('https');
const fs = require('fs');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MarylandApp/1.0 (test@example.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
           resolve(JSON.parse(data));
        } catch(e) {
           resolve({error: data});
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const cats = ['Rivers_of_Maryland', 'Rivers_of_Montgomery_County,_Maryland', 'Lakes_of_Maryland', 'Creeks_of_Maryland', 'Patapsco_River', 'Monocacy_River'];
  let allUrls = [];
  
  for (const cat of cats) {
      console.log('Fetching', cat);
      const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${cat}&cmnamespace=6&cmlimit=100&format=json`;
      const data = await fetchJson(url);
      if (data && data.query && data.query.categorymembers) {
          for (const m of data.query.categorymembers) {
              const fileTitle = m.title;
              if (fileTitle.match(/\.(jpg|jpeg)$/i)) {
                  allUrls.push(fileTitle);
              }
          }
      }
      await sleep(1000);
  }

  allUrls = [...new Set(allUrls)];
  allUrls = allUrls.filter(u => {
     const l = u.toLowerCase();
     return !l.includes('map') && !l.includes('logo') && !l.includes('sign') && !l.includes('pdf') && !l.includes('document') && !l.includes('aerial');
  });
  
  console.log('Total files found:', allUrls.length);
  
  const realUrls = [];
  for (let i = 0; i < allUrls.length; i+=50) {
      const batch = allUrls.slice(i, i+50);
      const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(batch.join('|'))}&format=json`;
      const data = await fetchJson(url);
      if (data && data.query && data.query.pages) {
          for (const key in data.query.pages) {
             const page = data.query.pages[key];
             if (page.imageinfo && page.imageinfo[0]) {
                 realUrls.push(page.imageinfo[0].url);
             }
          }
      }
      await sleep(1000);
  }
  
  fs.writeFileSync('md_water_images.json', JSON.stringify(realUrls, null, 2));
  console.log('Real URLs:', realUrls.length);
}
run();
