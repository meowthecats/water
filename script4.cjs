const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const navRegex = /(<div[^>]*ref=\{scrollRef\}[^>]*>)([\s\S]*?)(<Link[^>]*to="\/about"[\s\S]*?<\/div>)/;
const match = content.match(navRegex);
if(match) {
  const prefix = match[1];
  const linksRaw = match[2];
  const suffix = match[3];

  const linkRegex = /<Link[\s\S]*?<\/Link>/g;
  let links = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(linksRaw)) !== null) {
     links.push(linkMatch[0]);
  }
  
  links.sort((a, b) => {
     let nameA = a.match(/>\s*([^<>]+)\s*<\/Link>/)[1].trim();
     let nameB = b.match(/>\s*([^<>]+)\s*<\/Link>/)[1].trim();
     return nameA.localeCompare(nameB);
  });
  
  const newLinksStr = '\n        ' + links.join('\n        ') + '\n        ';
  const newContent = content.replace(navRegex, prefix + newLinksStr + suffix);
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Sorted successfully');
} else {
  console.log('Match failed');
}
