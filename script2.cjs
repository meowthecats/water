const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add ChevronLeft and ChevronRight
content = content.replace(
  "import { Droplets, X, ArrowRight, ArrowDownAZ, ArrowUpZA, ArrowUpDown, Map as MapIcon, Image as ImageIcon, Twitter, Facebook, Mail, Link as LinkIcon, Info, Home, Leaf, ShieldAlert, List, Compass } from 'lucide-react';",
  "import { Droplets, X, ArrowRight, ArrowDownAZ, ArrowUpZA, ArrowUpDown, Map as MapIcon, Image as ImageIcon, Twitter, Facebook, Mail, Link as LinkIcon, Info, Home, Leaf, ShieldAlert, List, Compass, ChevronLeft, ChevronRight } from 'lucide-react';"
);

// 2. Modify Navigation component
const oldNav = `function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex justify-center pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl md:rounded-[2rem] border border-slate-700/50 flex flex-nowrap items-center justify-start gap-2 pointer-events-auto shadow-xl max-w-full lg:max-w-6xl overflow-x-auto scrollbar-none">
`;

const newNav = `function Navigation() {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex justify-center pointer-events-none">
      <div className="relative pointer-events-auto flex items-center bg-slate-900/80 backdrop-blur-md px-2 py-3 rounded-2xl md:rounded-[2rem] border border-slate-700/50 shadow-xl max-w-full lg:max-w-6xl group">
        <button 
          onClick={scrollLeft}
          className="absolute left-2 z-10 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 shadow-md md:opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div 
          ref={scrollRef}
          className="flex flex-nowrap items-center justify-start gap-2 overflow-x-auto scrollbar-none px-12 sm:px-14 md:px-12 w-full"
        >
`;

content = content.replace(oldNav, newNav);

fs.writeFileSync('src/App.tsx', content);
