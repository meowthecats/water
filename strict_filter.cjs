const fs = require('fs');

const badWords = [
    'station', 'sign', 'school', 'portrait', 'mansion', 'trail', 'montage', '.svg', 'house', 'church', 'road', 
    'route', 'art_', 'street', 'library', 'person', 'man', 'people', 'robert', 'william', 'frederick_douglass', 
    'frederick_mccubbin', 'douglass_', 'lois_', 'incorporated', 'bridge', 'viaduct', 'aqueduct', 'dam', 
    'boy', 'girl', 'train', 'csx', 'marina', 'terminal', 'campus', 'building', 'highway', 'intersection',
    'evelynde', 'israel_putnam', 'robert_montgomery', 'william_h', 'frederick_cayley', 'hiawatha', 'madison_house',
    'town_of', 'city_hall', 'montage', 'logo', 'flag', 'seal', '117', '231', '144', '355', '3090', '193',
    'st.', 'saint', 'estate'
];

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let usedUrls = new Set();
let replacementsCount = 0;

function isBadUrl(url) {
    const l = url.toLowerCase();
    for (const word of badWords) {
        if (l.includes(word)) return true;
    }
    return false;
}

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  let updated = false;

  let currentName = '';

  for (let i = 0; i < lines.length; i++) {
    let nameMatch = lines[i].match(/(['"]?)name\1\s*:\s*["']([^"']+)["']/);
    if (nameMatch) {
        currentName = nameMatch[2];
    }

    let imageMatch = lines[i].match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*)(["'])([^"']+)\2(,?\s*(?:\/\/.*)?)$/);
    if (imageMatch && currentName) {
      let url = imageMatch[3];
      
      let needsReplace = isBadUrl(url);

      if (!needsReplace && !url.includes('placeholders.dev')) {
         if (usedUrls.has(url)) {
            needsReplace = true; // duplicate
         } else {
            usedUrls.add(url);
         }
      }

      if (needsReplace) {
         let newUrl = `https://images.placeholders.dev/?width=800&height=600&text=${encodeURIComponent(currentName)}&bgColor=%231e293b&textColor=%2394a3b8`;
         lines[i] = imageMatch[1] + imageMatch[2] + newUrl + imageMatch[2] + imageMatch[4];
         updated = true;
         replacementsCount++;
         console.log(`Replaced bad/duplicate URL for ${currentName}`);
      }
      currentName = '';
    }
  }

  if (updated) {
    fs.writeFileSync(f, lines.join('\n'), 'utf8');
  }
}

console.log(`Finished. Replaced ${replacementsCount} images.`);
