const https = require("https");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';
const publicId = "pandamarket/categories/produce/products/fresh-corn-4-ears/1";
const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/${publicId}`;
console.log("Testing URL:", url);

https.get(url, (res) => {
  console.log("Status code:", res.statusCode);
  console.log("Content-Type:", res.headers["content-type"]);
  console.log("X-Cld-Error:", res.headers["x-cld-error"]);
}).on("error", (e) => {
  console.error("HTTP error:", e);
});
