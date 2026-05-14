import fs from 'fs';

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function findExactImage(name, county) {
  let searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('"' + name + '" Maryland')}&utf8=&format=json&srlimit=3`;
  try {
      let res = await fetch(searchUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
      let data = await res.json();
      if (data.query && data.query.search && data.query.search.length > 0) {
          for(let r of data.query.search) {
              let imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(r.title)}&prop=pageimages&format=json&pithumbsize=1000`;
              let res2 = await fetch(imgUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
              let data2 = await res2.json();
              if (data2?.query?.pages) {
                  let pageKeys = Object.keys(data2.query.pages);
                  if (pageKeys.length > 0 && pageKeys[0] !== '-1') {
                      let page = data2.query.pages[pageKeys[0]];
                      if (page.thumbnail && page.thumbnail.source && !page.thumbnail.source.includes('.svg') && !page.thumbnail.source.includes('map')) {
                          return page.thumbnail.source;
                      }
                  }
              }
          }
      }
  } catch(e) {}

  let commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name + ' Maryland')}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&format=json`;
  try {
      let res3 = await fetch(commonsUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
      let data3 = await res3.json();
      if (data3?.query?.pages) {
          for (const key in data3.query.pages) {
              const url = data3.query.pages[key].imageinfo[0].url;
              if (url.match(/\.(jpg|jpeg|png)$/i) && !url.toLowerCase().includes('map') && !url.toLowerCase().includes('logo')) {
                  return url;
              }
          }
      }
  } catch(e) {}
  
  let commonsUrl2 = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name + ' water')}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`;
  try {
      let res4 = await fetch(commonsUrl2, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
      let data4 = await res4.json();
      if (data4?.query?.pages) {
          for (const key in data4.query.pages) {
              const url = data4.query.pages[key].imageinfo[0].url;
              if (url.match(/\.(jpg|jpeg|png)$/i) && !url.toLowerCase().includes('map') && !url.toLowerCase().includes('logo')) {
                  return url;
              }
          }
      }
  } catch(e) {}
  
  return null;
}

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
                let img = await findExactImage(e.name, e.county);
                if (img) {
                    console.log(`[FOUND] ${e.name} -> ${img}`);
                    lines[e.lineIndex] = currentLine.replace(/"image":\s*["'][^"']*["']/, `"image": "${img}"`);
                    updated = true;
                } else {
                    console.log(`[NOT FOUND] ${e.name}`);
                }
                await new Promise(r => setTimeout(r, 250));
            }
        }
        if (updated) {
            fs.writeFileSync(f, lines.join('\n'), 'utf8');
        }
    }
}
run();
