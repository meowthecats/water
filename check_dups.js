import fs from 'fs';

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let allUrls = [];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  for (const l of lines) {
      const match = l.match(/image\s*:\s*["']([^"']+)["']/);
      if (match) {
          allUrls.push(match[1]);
      }
  }
}

let setUrls = new Set(allUrls);
console.log(`Total URLs: ${allUrls.length}`);
console.log(`Unique URLs: ${setUrls.size}`);
if (allUrls.length !== setUrls.size) {
    console.log("Duplicates found:");
    let seen = new Set();
    for(const u of allUrls) {
        if(seen.has(u)) console.log(u);
        seen.add(u);
    }
}
