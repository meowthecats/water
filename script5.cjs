const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0" role="list" aria-label="Bodies of water gallery">
          {paginatedBodiesOfWater.map((item, index) => (
            <motion.div
              key={item.id}
              ref={(el) => {`;

const replaceStr = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0" role="list" aria-label="Bodies of water gallery">
          <AnimatePresence mode="popLayout">
          {paginatedBodiesOfWater.map((item, index) => (
            <motion.div
              key={\`\${item.id}-\${currentPage}-\${sortOrder}\`}
              ref={(el) => {`;

const targetStr2 = `              layoutId={\`card-\${item.id}\`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedId(item.id)}`;

const replaceStr2 = `              layoutId={\`card-\${item.id}\`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              onClick={() => setSelectedId(item.id)}`;

const targetStr3 = `              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (`;

const replaceStr3 = `              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (`;

if (content.includes(targetStr) && content.includes(targetStr2) && content.includes(targetStr3)) {
  content = content.replace(targetStr, replaceStr);
  content = content.replace(targetStr2, replaceStr2);
  content = content.replace(targetStr3, replaceStr3);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Success");
} else {
  console.log("Failed to find targets");
  if (!content.includes(targetStr)) console.log("Missing target 1");
  if (!content.includes(targetStr2)) console.log("Missing target 2");
  if (!content.includes(targetStr3)) console.log("Missing target 3");
}
