const fs = require('fs');
const https = require('https');

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'MarylandWaterwaysGallery/1.0 (test@example.com)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

function scoreImg(url, name) {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('map') || lowerUrl.includes('logo') || lowerUrl.includes('aerial') || lowerUrl.includes('sign')) score -= 10;
  if (lowerUrl.includes('creek') || lowerUrl.includes('river') || lowerUrl.includes('lake')) score += 1;
  const parts = name.toLowerCase().split(' ');
  for (const part of parts) {
    if (part.length > 3 && lowerUrl.includes(part)) score += 5;
  }
  return score;
}

async function searchImage(query, name) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url`;
  try {
    const data = await fetchJson(url);
    if (data && data.query && data.query.pages) {
      let bestImg = null;
      let bestScore = -999;
      for (const key in data.query.pages) {
        if (data.query.pages[key].imageinfo) {
          const imgUrl = data.query.pages[key].imageinfo[0].url;
          if (imgUrl.match(/\.(jpg|jpeg|png)$/i)) {
             const s = scoreImg(imgUrl, name);
             if (s > bestScore) {
               bestScore = s;
               bestImg = imgUrl;
             }
          }
        }
      }
      return bestImg;
    }
  } catch (e) {
  }
  return null;
}

// Pre-fetched clean MD water images
const fallbacks = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
let fallbackIdx = 0;

async function run() {
  for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    let currentName = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        let nameMatch = line.match(/(['"]?)name\1\s*:\s*["']([^"']+)["']/);
        if (nameMatch) {
            currentName = nameMatch[2];
        }
        
        let imageMatch = line.match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*["'])([^"']+)(["'],?.*)$/);
        
        if (imageMatch && currentName) {
            console.log(`Checking: ${currentName}`);
            let imgUrl = await searchImage(`"${currentName}" Maryland`, currentName);
            if (!imgUrl) {
                imgUrl = await searchImage(`${currentName} water`, currentName);
            }
            if (!imgUrl) {
                // Find a fallback that has no bad words
                while (fallbackIdx < fallbacks.length) {
                   const fba = fallbacks[fallbackIdx++];
                   const l = fba.toLowerCase();
                   if (!l.includes('map') && !l.includes('aerial') && !l.includes('sign') && !l.includes('logo')) {
                      imgUrl = fba;
                      break;
                   }
                }
            }
            
            if (imgUrl && imgUrl !== imageMatch[2]) {
                lines[i] = imageMatch[1] + imgUrl + imageMatch[3];
                console.log(`  -> ${imgUrl}`);
            }
            currentName = '';
            await new Promise(r => setTimeout(r, 600)); // be nice to Wikimedia
        }
    }
    fs.writeFileSync(f, lines.join('\n'), 'utf8');
  }
  console.log("Done.");
}
run();
