const fs = require('fs');
const path = require('path');

function scanDir(dir, prefix = "") {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, `${prefix}${item}/`);
    } else {
      console.log(`${prefix}${item} (${Math.round(stat.size / 1024)} KB)`);
    }
  }
}

console.log("=== PUBLIC IMAGES ===");
scanDir(path.join(__dirname, '..', 'public', 'images'));

console.log("\n=== GENERATED IMAGES ===");
scanDir(path.join(__dirname, '..', 'generated-images'));
