import fs from 'fs';

const pool = JSON.parse(fs.readFileSync('src/md_water_pool.json', 'utf8'));

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let usedUrls = new Set();
let duplicates = [];
let allUrls = [];

// find duplicates
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  for (const l of lines) {
      const match = l.match(/"image"\s*:\s*["']([^"']+)["']/);
      if (match) {
          if (usedUrls.has(match[1])) {
              duplicates.push(match[1]);
          } else {
              usedUrls.add(match[1]);
          }
          allUrls.push(match[1]);
      }
  }
}

console.log("Duplicates:", duplicates);

let poolIndex = 0;
// replace duplicates
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  let updated = false;

  let fileUsedUrls = new Set();

  for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/"image"\s*:\s*["']([^"']+)["']/);
      if (match) {
          if (fileUsedUrls.has(match[1]) || (duplicates.includes(match[1]) && usedUrls.has(match[1]))) {
              // we only want to replace the SECOND appearance of the url, so we do it if we've seen it 
              // Wait, simpler: if it's in duplicates, replace it and remove from duplicates so we only replace 1 
              if (duplicates.includes(match[1])) {
                 let url = pool[poolIndex];
                 while (usedUrls.has(url)) {
                     poolIndex++;
                     url = pool[poolIndex];
                 }
                 usedUrls.add(url);
                 lines[i] = lines[i].replace(match[1], url);
                 updated = true;
                 
                 // Remove one instance from duplicates
                 duplicates.splice(duplicates.indexOf(match[1]), 1);
              }
          }
          fileUsedUrls.add(match[1]);
      }
  }
  if (updated) fs.writeFileSync(f, lines.join('\n'), 'utf8');
}
