const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

// Shuffle array deterministically or randomly
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
shuffle(urls);

const files = [
  'src/App.tsx',
  'src/frederickData.ts',
  'src/baltimoreData.ts',
  'src/frederickDataPart2.ts',
  'src/montgomeryDataPart2.ts'
];

let urlIndex = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // App.tsx and others have "image": "(url)"
  // The generator files have image: '(url)'
  
  const modified = content.replace(/(["']?image["']?\s*:\s*["'])([^"']+)(["'])/g, (match, prefix, oldUrl, suffix) => {
    if (urlIndex < urls.length) {
      const newUrl = urls[urlIndex++];
      return prefix + newUrl + suffix;
    }
    return match;
  });
  
  fs.writeFileSync(f, modified, 'utf8');
});

console.log('Replaced', urlIndex, 'images');
