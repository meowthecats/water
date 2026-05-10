const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function searchImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AIStudioDemoBot/1.0 (sorahitoshi89@gmail.com)'
      }
    });
    
    if (res.status === 429) {
      console.log('Rate limited! Waiting 5 seconds...');
      await new Promise(r => setTimeout(r, 5000));
      return await searchImage(query); // retry once
    }
    
    const text = await res.text();
    if (text.startsWith('<') || text.includes('You are making too many requests')) {
       console.log('Rate limited via HTML response! Waiting 5s...');
       await new Promise(r => setTimeout(r, 5000));
       return null;
    }
    
    const data = JSON.parse(text);
    if (data.query && data.query.pages) {
      for (const key in data.query.pages) {
        if (data.query.pages[key].imageinfo) {
          const imgUrl = data.query.pages[key].imageinfo[0].url;
          if (imgUrl.match(/\.(jpg|jpeg|png)$/i)) {
            const lower = imgUrl.toLowerCase();
            if(lower.includes('map') || lower.includes('logo') || lower.includes('aerial') || lower.includes('sign') || lower.includes('document')) {
              continue;
            }
            return imgUrl;
          }
        }
      }
      
      // Fallback
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
    console.error("Error for", query, e.message);
  }
  return null;
}

const cache = {};

async function run() {
  for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    
    let currentName = '';
    const lines = content.split('\n');
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        let nameMatch = line.match(/(['"]?)name\1\s*:\s*["']([^"']+)["']/);
        if (nameMatch) {
            currentName = nameMatch[2];
        }
        
        let imageMatch = line.match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*["'])([^"']+)(["'],?.*)$/);
        
        if (imageMatch && currentName) {
            console.log(`Checking image for: ${currentName}`);
            
            let img = null;
            if (cache[currentName]) {
                img = cache[currentName];
            } else {
                img = await searchImage(currentName + " Maryland water");
                if (!img) {
                  await new Promise(r => setTimeout(r, 1000));
                  img = await searchImage(currentName + " Maryland creek river lake");
                }
                if (!img) {
                  await new Promise(r => setTimeout(r, 1000));
                  img = await searchImage(currentName + " Maryland");
                }
                if (!img) {
                  img = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Seneca_Creek_State_Park_Lake.jpg"; // safe default
                }
                cache[currentName] = img;
                await new Promise(r => setTimeout(r, 1500)); // sleep to avoid rate limit
            }
            
            if (img && img !== imageMatch[2]) {
                console.log(`Found: ${img}`);
                lines[i] = imageMatch[1] + img + imageMatch[3];
                updated = true;
            }
            currentName = '';
        }
    }
    
    if (updated) {
      fs.writeFileSync(f, lines.join('\n'), 'utf8');
      console.log(`Updated ${f}`);
    }
  }
  console.log("Done updating images.");
}
run();
