eval(`
const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Use stronger drop shadow on texts
content = content.replace('text-slate-200 max-w-xl text-lg font-light leading-relaxed drop-shadow-md mx-auto', 'text-slate-100 max-w-xl text-lg font-medium leading-relaxed drop-shadow-xl mx-auto');
content = content.replace('text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-50 drop-shadow-md mb-6', 'text-4xl md:text-5xl font-serif font-medium tracking-tight text-white drop-shadow-xl mb-6');
content = content.replace('text-4xl md:text-6xl font-serif font-medium tracking-tight text-white drop-shadow-lg mb-4', 'text-4xl md:text-7xl font-serif font-bold tracking-tight text-white drop-shadow-2xl mb-4');

// About cards: increase opacity
content = content.replaceAll('className=\"bg-slate-900/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md flex flex-col\"', 'className=\"bg-slate-950/70 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-lg flex flex-col shadow-2xl\"');
content = content.replaceAll('className=\"bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-700/50 backdrop-blur-md\"', 'className=\"bg-slate-950/70 p-8 md:p-10 rounded-3xl border border-slate-700/50 backdrop-blur-lg shadow-2xl\"');
content = content.replaceAll('text-slate-400', 'text-slate-300'); // Lighten up the slate-400 all over to slate-300

// Gallery Grid Cards
content = content.replaceAll('className=\"text-3xl font-serif font-medium text-slate-50 mb-2\"', 'className=\"text-3xl font-serif font-bold text-white drop-shadow-lg mb-2\"');

// And the applet backdrop blur
content = content.replaceAll('bg-slate-950/70 backdrop-blur-[2px]', 'bg-slate-950/80 backdrop-blur-sm');

fs.writeFileSync('src/App.tsx', content);
`)
