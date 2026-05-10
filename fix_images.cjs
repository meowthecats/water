const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function searchImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.query && data.query.pages) {
      for (const key in data.query.pages) {
        if (data.query.pages[key].imageinfo) {
          const imgUrl = data.query.pages[key].imageinfo[0].url;
          if (imgUrl.match(/\.(jpg|jpeg|png)$/i)) {
            // avoid maps if possible
            if(imgUrl.toLowerCase().includes('map') || imgUrl.toLowerCase().includes('logo') || imgUrl.toLowerCase().includes('aerial')) {
              continue;
            }
            return imgUrl;
          }
        }
      }
      
      // Fallback if all were maps/logos
      for (const key in data.query.pages) {
        if (data.query.pages[key].imageinfo) {
          const imgUrl = data.query.pages[key].imageinfo[0].url;
          if (imgUrl.match(/\.(jpg|jpeg|png)$/i)) {
            return imgUrl;
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

const cache = {};

async function run() {
  for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    
    let currentName = '';
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        let nameMatch = line.match(/(['"]?)name\1\s*:\s*["']([^"']+)["']/);
        if (nameMatch) {
            currentName = nameMatch[2];
        }
        
        // Match both "image": "url" and image: "url"
        let imageMatch = line.match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*["'])([^"']+)(["'],?.*)$/);
        
        if (imageMatch && currentName) {
            console.log(`Checking image for: ${currentName}`);
            
            let img = null;
            if (cache[currentName]) {
                img = cache[currentName];
            } else {
                img = await searchImage(currentName + " Maryland");
                if (!img) {
                  img = await searchImage(currentName + " water");
                }
                if (!img) {
                  img = await searchImage(currentName);
                }
                cache[currentName] = img;
                await new Promise(r => setTimeout(r, 200)); // sleep to abide by rate limit somewhat
            }
            
            if (img && img !== imageMatch[2]) {
                console.log(`Found: ${img}`);
                lines[i] = imageMatch[1] + img + imageMatch[3];
            } else if (!img) {
                console.log(`No image found for ${currentName}`);
            }
        }
    }
    
    fs.writeFileSync(f, lines.join('\n'), 'utf8');
  }
  console.log("Done updating images.");
}
run();
