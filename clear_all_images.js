import fs from 'fs';

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

for(const f of files) {
    if (!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    let lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"image":')) {
            // Replace with empty string
            lines[i] = lines[i].replace(/"image":\s*["'][^"']*["']/, `"image": ""`);
            updated = true;
        }
    }
    if (updated) {
        fs.writeFileSync(f, lines.join('\n'), 'utf8');
    }
}
