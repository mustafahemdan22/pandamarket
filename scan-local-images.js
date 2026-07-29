const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (/\.(webp|png|jpg|jpeg|svg)$/i.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const genImgs = scanDir(path.join(__dirname, 'generated-images'));
const pubImgs = scanDir(path.join(__dirname, 'public'));

console.log(`Found ${genImgs.length} images in 'generated-images'`);
console.log(`Found ${pubImgs.length} images in 'public'`);

console.log("\nSample images in generated-images (first 10):");
genImgs.slice(0, 10).forEach(f => console.log(" -", path.relative(__dirname, f)));

console.log("\nSample images in public (first 10):");
pubImgs.slice(0, 10).forEach(f => console.log(" -", path.relative(__dirname, f)));
