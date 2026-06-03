const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        </Link>
      </div>
    </nav>`;

const replacementStr = `        </Link>
        </div>
        <button 
          onClick={scrollRight}
          className="absolute right-2 z-10 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 shadow-md md:opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </nav>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', content);
