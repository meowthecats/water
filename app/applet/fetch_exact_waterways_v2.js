import fs from 'fs';

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function findExactImage(name, county) {
  // Try several titles
  let titles = [
    `${name}`,
    `${name}, Maryland`,
    `${name} (Maryland)`,
    `${name} (${county} County, Maryland)`,
    `${name} (${county} County)`
  ];
  
  // also try wikidata search or wikipedia search
  let searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('"' + name + '" Maryland')}&utf8=&format=json&srlimit=3`;
  try {
      let res = await fetch(searchUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
      let data = await res.json();
      if (data.query && data.query.search && data.query.search.length > 0) {
          // If the first result's title contains the name, let's query its page image
          for(let r of data.query.search) {
              if (r.title.toLowerCase().includes(name.toLowerCase())) {
                  titles.unshift(r.title); // put at top priority
              }
          }
      }
  } catch(e) {}

  // now query page images
  for (const t of titles) {
      let imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(t)}&prop=pageimages&format=json&pithumbsize=1000`;
      try {
          let res = await fetch(imgUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
          let data = await res.json();
          let pages = data?.query?.pages;
          if (pages) {
              let pageKeys = Object.keys(pages);
              if (pageKeys.length > 0 && pageKeys[0] !== '-1') {
                  let page = pages[pageKeys[0]];
                  if (page.thumbnail && page.thumbnail.source) {
                      return page.thumbnail.source;
                  }
              }
          }
      } catch(e) {}
  }
  return null;
}

async function run() {
    let allEntries = [];
    
    // basic parsing
    for (const f of files) {
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        let lines = content.split('\n');
        let updated = false;

        for (let i = 0; i < lines.length; i++) {
            let m = lines[i].match(/"name":\s*"([^"]+)"/);
            if (m) {
                let name = m[1];
                let county = '';
                if (f.includes('baltimore')) county = 'Baltimore';
                else if (f.includes('frederick')) county = 'Frederick';
                else if (f.includes('montgomery')) county = 'Montgomery';
                
                // look for image key nearby:
                for(let j = i; j < i + 10 && j < lines.length; j++) {
                    if (lines[j].includes('"image":')) {
                        allEntries.push({file: f, lineIndex: j, name, county, origUrl: lines[j]});
                        break;
                    }
                }
            }
        }
    }
    
    console.log(`Found ${allEntries.length} entries to process.`);
    for (let e of allEntries) {
        let img = await findExactImage(e.name, e.county);
        if (img) {
            console.log(`[FOUND] ${e.name} -> ${img}`);
            e.newImg = img;
        } else {
            console.log(`[NOT FOUND] ${e.name}`);
            e.newImg = null;
        }
        await new Promise(r => setTimeout(r, 200)); // sleep to avoid rate limits
    }
    
    // Now apply changes 
    for(const f of files) {
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        let lines = content.split('\n');
        let updated = false;

        let fileEntries = allEntries.filter(e => e.file === f);
        for (let e of fileEntries) {
            if (e.newImg) {
                // replace with new image
                lines[e.lineIndex] = lines[e.lineIndex].replace(/"image":\s*"[^"]+"/, `"image": "${e.newImg}"`);
            } else {
                // fallback to removing the image completely!
                // Wait, if we remove it, we must ensure syntax is valid (comma at end might be needed or need to be removed if it's last)
                // To avoid JSON-like syntax errors, we can just replace with empty string or a static constant flag like 'NO_IMAGE'
                lines[e.lineIndex] = lines[e.lineIndex].replace(/"image":\s*"[^"]+"/, `"image": ""`);
            }
            updated = true;
        }
        if (updated) {
            fs.writeFileSync(f, lines.join('\n'), 'utf8');
        }
    }
}

run();
