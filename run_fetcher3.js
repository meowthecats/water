import fs from 'fs';

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function findExactImage(name, county) {
  const queries = [
      `${name}`,
      `${name} Maryland`,
      `${name} ${county} County`
  ];
  
  for (let q of queries) {
      let commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json`;
      try {
          let res3 = await fetch(commonsUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
          let data3 = await res3.json();
          if (data3?.query?.pages) {
              for (const key in data3.query.pages) {
                  const url = data3.query.pages[key].imageinfo[0].url;
                  const title = data3.query.pages[key].title.toLowerCase();
                  if (url.match(/\.(jpg|jpeg|png)$/i) && !title.includes('map') && !title.includes('logo') && !title.includes('diagram') && !title.includes('portrait')) {
                      return url;
                  }
              }
          }
      } catch(e) {}
  }
  
  return null;
}

const fallbackPool = JSON.parse(fs.readFileSync('src/md_water_pool.json', 'utf8'));
let fallbackIndex = 0;

async function run() {
    let allEntries = [];
    
    for (const f of files) {
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let m = lines[i].match(/"name":\s*"([^"]+)"/);
            if (m) {
                let name = m[1];
                let county = f.includes('baltimore') ? 'Baltimore' : (f.includes('frederick') ? 'Frederick' : 'Montgomery');
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
    for (const f of files) {
        if (!fs.existsSync(f)) continue;
        let content = fs.readFileSync(f, 'utf8');
        let lines = content.split('\n');
        let updated = false;

        let fileEntries = allEntries.filter(e => e.file === f);
        for (let e of fileEntries) {
            let currentLine = lines[e.lineIndex];
            if (currentLine.match(/"image":\s*""/) || currentLine.match(/"image":\s*"[^h]/)) { // empty or default
                let img = null;
                // Try Wikipedia Exact Image first (skip for speed here since we have an elaborate search)
                img = await findExactImage(e.name, e.county);
                if (!img) {
                    img = fallbackPool[fallbackIndex % fallbackPool.length];
                    fallbackIndex++;
                }
                
                if (img) {
                    console.log(`[FOUND/FALLBACK] ${e.name} -> ${img}`);
                    lines[e.lineIndex] = currentLine.replace(/"image":\s*["'][^"']*["']/, `"image": "${img}"`);
                    updated = true;
                }
                await new Promise(r => setTimeout(r, 200));
            }
        }
        if (updated) {
            fs.writeFileSync(f, lines.join('\n'), 'utf8');
        }
    }
}
run();
