const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = `
import { princeGeorgesData } from './princeGeorgesData';
import { queenAnnesData } from './queenAnnesData';
import { stMarysData } from './stMarysData';
import { somersetData } from './somersetData';
import { talbotData } from './talbotData';
import { washingtonData } from './washingtonData';
import { wicomicoData } from './wicomicoData';
import { worcesterData } from './worcesterData';
`;
content = content.replace(/import \{ kentData \} from '\.\/kentData';/, "import { kentData } from './kentData';" + newImports);

const kentLinkStr = '          <MapIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />\n          Kent\n        </Link>';
const additionalLinks = [
  { path: '/prince-georges', name: "Prince George's", short: "Prince George's" },
  { path: '/queen-annes', name: "Queen Anne's", short: "Queen Anne's" },
  { path: '/st-marys', name: "St. Mary's", short: "St. Mary's" },
  { path: '/somerset', name: "Somerset", short: "Somerset" },
  { path: '/talbot', name: "Talbot", short: "Talbot" },
  { path: '/washington', name: "Washington", short: "Washington" },
  { path: '/wicomico', name: "Wicomico", short: "Wicomico" },
  { path: '/worcester', name: "Worcester", short: "Worcester" }
];

let linksHtml = '';
for(let l of additionalLinks) {
  linksHtml += `\n        <Link\n          to="${l.path}"\n          className={\`shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium transition-colors \${location.pathname === '${l.path}' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-slate-200 hover:bg-slate-900/40'}\`}\n        >\n          <MapIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />\n          ${l.short}\n        </Link>`;
}
content = content.replace(kentLinkStr, kentLinkStr + linksHtml);

let routesHtmlStr = '';
const kentRouteStr = '<Route path="/kent" element={<Gallery title="Kent County Waterways" items={kentData} />} />';
routesHtmlStr += `\n        <Route path="/prince-georges" element={<Gallery title="Prince George's County Waterways" items={princeGeorgesData} />} />`;
routesHtmlStr += `\n        <Route path="/queen-annes" element={<Gallery title="Queen Anne's County Waterways" items={queenAnnesData} />} />`;
routesHtmlStr += `\n        <Route path="/st-marys" element={<Gallery title="St. Mary's County Waterways" items={stMarysData} />} />`;
routesHtmlStr += `\n        <Route path="/somerset" element={<Gallery title="Somerset County Waterways" items={somersetData} />} />`;
routesHtmlStr += `\n        <Route path="/talbot" element={<Gallery title="Talbot County Waterways" items={talbotData} />} />`;
routesHtmlStr += `\n        <Route path="/washington" element={<Gallery title="Washington County Waterways" items={washingtonData} />} />`;
routesHtmlStr += `\n        <Route path="/wicomico" element={<Gallery title="Wicomico County Waterways" items={wicomicoData} />} />`;
routesHtmlStr += `\n        <Route path="/worcester" element={<Gallery title="Worcester County Waterways" items={worcesterData} />} />`;
content = content.replace(kentRouteStr, kentRouteStr + routesHtmlStr);

content = content.replace('"Garrett", "Harford", "Howard", "Kent", "Allegany"', '"Garrett", "Harford", "Howard", "Kent", "Prince George\'s", "Queen Anne\'s", "St. Mary\'s", "Somerset", "Talbot", "Washington", "Wicomico", "Worcester", "Allegany"');

fs.writeFileSync('src/App.tsx', content);
