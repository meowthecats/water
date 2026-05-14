const fs = require('fs');
const https = require('https');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MarylandApp/v2.0 (test@example.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function searchWikipediaImage(query) {
  // First search for the article
  let searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
  let searchData = await fetchJson(searchUrl);
  if (searchData && searchData.query && searchData.query.search && searchData.query.search.length > 0) {
     const title = searchData.query.search[0].title;
     // Fetch page image
     let imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
     let imgData = await fetchJson(imgUrl);
     if (imgData && imgData.query && imgData.query.pages) {
         for (const key in imgData.query.pages) {
            if (imgData.query.pages[key].original) {
               const url = imgData.query.pages[key].original.source;
               const lower = url.toLowerCase();
               if (!lower.includes('map') && !lower.includes('logo') && !lower.includes('flag') && !lower.includes('seal')) {
                  return url;
               }
            }
         }
     }
  }
  return null;
}

async function searchCommonsMatch(name, county) {
   let query = `intitle:"${name.split(' ')[0]}" ${county}`;
   let url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url`;
   
   let data = await fetchJson(url);
   if (data && data.query && data.query.pages) {
       for (const key in data.query.pages) {
           const title = data.query.pages[key].title.toLowerCase();
           const fileUrl = data.query.pages[key].imageinfo[0].url.split('?')[0];
           
           if (!fileUrl.match(/\.(jpg|jpeg|png)$/i)) continue;
           if (title.includes('map') || title.includes('logo') || title.includes('document')) continue;
           if (title.includes(name.split(' ')[0].toLowerCase())) {
               return fileUrl;
           }
       }
   }
   
   return null;
}

async function getBestImage(name, county) {
   let img = await searchWikipediaImage(`${name} ${county} Maryland`);
   if (img) return img;
   await sleep(100);
   img = await searchWikipediaImage(name);
   if (img) return img;
   await sleep(100);
   img = await searchCommonsMatch(name, county);
   if (img) return img;
   
   // Create a placeholder block
   return `https://images.placeholders.dev/?width=800&height=600&text=${encodeURIComponent(name)}&bgColor=%231e293b&textColor=%2394a3b8`;
}

const files = [
  { path: 'src/App.tsx', county: 'Montgomery' },
  { path: 'src/frederickData.ts', county: 'Frederick' },
  { path: 'src/baltimoreData.ts', county: 'Baltimore' },
  { path: 'src/frederickDataPart2.ts', county: 'Frederick' },
  { path: 'src/montgomeryDataPart2.ts', county: 'Montgomery' }
];

async function run() {
  const usedUrls = new Set();
  
  for (const f of files) {
      if (!fs.existsSync(f.path)) continue;
      let content = fs.readFileSync(f.path, 'utf8');
      const lines = content.split('\n');
      let currentName = '';
      let updated = false;

      for (let i = 0; i < lines.length; i++) {
        let nameMatch = lines[i].match(/(['"]?)name\1\s*:\s*["']([^"']+)["']/);
        if (nameMatch) {
            currentName = nameMatch[2];
        }
        
        // Match image line carefully capturing quotes
        let imageMatch = lines[i].match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*)(["'])([^"']+)\2(,?\s*)$/);
        
        if (imageMatch && currentName) {
            console.log(`Searching for: ${currentName}`);
            let url = await getBestImage(currentName, f.county);
            
            // Check for duplicates, but allow placeholders to duplicate (since they encode name, they are technically unique by name)
            if (!url.includes('placeholders.dev') && usedUrls.has(url)) {
               url = `https://images.placeholders.dev/?width=800&height=600&text=${encodeURIComponent(currentName)}&bgColor=%231e293b&textColor=%2394a3b8`;
            }
            usedUrls.add(url);
            
            console.log(`  -> ${url}`);
            lines[i] = imageMatch[1] + imageMatch[2] + url + imageMatch[2] + imageMatch[4];
            updated = true;
            currentName = '';
            await sleep(200);
        }
      }

      if (updated) {
         fs.writeFileSync(f.path, lines.join('\n'), 'utf8');
      }
  }
}

run();
