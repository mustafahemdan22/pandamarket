const fs = require('fs');
const path = require('path');

function getFolderStructure(baseDir) {
  const result = [];
  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(currentDir, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else if (/\.(webp|png|jpg|jpeg)$/i.test(item.name)) {
        result.push(path.relative(baseDir, full));
      }
    }
  }
  walk(baseDir);
  return result;
}

console.log("=== GENERATED-IMAGES ===");
const genFiles = getFolderStructure(path.join(__dirname, 'generated-images'));
genFiles.forEach(f => console.log(" ", f));

console.log("\n=== PUBLIC/IMAGES ===");
const pubFiles = getFolderStructure(path.join(__dirname, 'public', 'images'));
pubFiles.forEach(f => console.log(" ", f));
