import fs from 'fs';

const pool = JSON.parse(fs.readFileSync('src/md_water_pool.json', 'utf8'));
const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let poolIndex = 0;
let usedUrls = new Set();
let replacements = 0;

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  let updated = false;

  for (let i = 0; i < lines.length; i++) {
    // Check if the line has an image property that contains placehold.co
    if (lines[i].includes('image:') || lines[i].includes('"image"')) {
        if (lines[i].includes('placehold.co') || lines[i].includes('placeholders.dev')) {
           // We need to replace it.
           let url = pool[poolIndex % pool.length];
           
           // Ensure uniqueness if possible
           let attempts = 0;
           while(usedUrls.has(url) && attempts < pool.length) {
               poolIndex++;
               url = pool[poolIndex % pool.length];
               attempts++;
           }
           usedUrls.add(url);
           poolIndex++;

           // replace the URL
           lines[i] = lines[i].replace(/https:\/\/(placehold\.co|images\.placeholders\.dev)[^"']+/, url);
           updated = true;
           replacements++;
        }
    }
  }

  if (updated) {
    fs.writeFileSync(f, lines.join('\n'), 'utf8');
  }
}

console.log(`Replaced ${replacements} placeholders with real photos.`);
