const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let mdUrls = JSON.parse(fs.readFileSync('md_water_images.json', 'utf8'));

// clean up query params and filter bad names
mdUrls = mdUrls.map(u => u.split('?')[0]);
mdUrls = mdUrls.filter(u => {
    const l = u.toLowerCase();
    if (l.includes('map') || l.includes('folio') || l.includes('plate') || l.includes('text') || l.includes('diagram') || l.includes('document')) return false;
    return true;
});

// We want enough images so let's shuffle them
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(mdUrls);

let imgIdx = 0;

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    let updated = false;
    for (let i = 0; i < lines.length; i++) {
        let imageMatch = lines[i].match(/^(\s*(?:['"]?)image(?:['"]?)\s*:\s*["'])([^"']+)(["'],?.*)$/);
        
        if (imageMatch) {
            let newUrl = mdUrls[imgIdx % mdUrls.length];
            lines[i] = imageMatch[1] + newUrl + imageMatch[3];
            imgIdx++;
            updated = true;
        }
    }
    if (updated) {
       fs.writeFileSync(f, lines.join('\n'), 'utf8');
       console.log('Updated ' + f);
    }
}
console.log('Done mapping beautiful unique pictures.');
