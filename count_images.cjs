const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let total = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const count = (content.match(/  (\w+:\s*)?"image":/g) || []).length;
  console.log(f, count);
  total += count;
});
console.log('Total:', total);
