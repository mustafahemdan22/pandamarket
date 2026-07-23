const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.ts');

let content = fs.readFileSync(productsFile, 'utf-8');

// Replace all instances of `imagePublicId: 'pandamarket/` or `imagePublicId: "pandamarket/` with leading slash
content = content.replace(/imagePublicId:\s*(['"])pandamarket\//g, "imagePublicId: $1/pandamarket/");

fs.writeFileSync(productsFile, content);

console.log('Updated data/products.ts to use local paths (leading slash)!');
