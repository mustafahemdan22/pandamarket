const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

async function auditCloudinary() {
  console.log("==========================================");
  console.log("      CLOUDINARY AUTHENTICATION AUDIT     ");
  console.log("==========================================");

  const rawCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const rawApiKey = process.env.CLOUDINARY_API_KEY;
  const rawApiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("\n1. ENVIRONMENT VARIABLE INSPECTION");
  console.log(`- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "${rawCloudName}" (len: ${rawCloudName ? rawCloudName.length : 0})`);
  console.log(`- CLOUDINARY_API_KEY: "${rawApiKey}" (len: ${rawApiKey ? rawApiKey.length : 0})`);
  console.log(`- CLOUDINARY_API_SECRET: "${rawApiSecret ? rawApiSecret.slice(0, 4) + '...' + rawApiSecret.slice(-4) : ''}" (len: ${rawApiSecret ? rawApiSecret.length : 0})`);

  // Check for hidden characters, whitespace, quotes
  const cleanCloudName = rawCloudName ? rawCloudName.trim().replace(/^['"]|['"]$/g, '') : '';
  const cleanApiKey = rawApiKey ? rawApiKey.trim().replace(/^['"]|['"]$/g, '') : '';
  const cleanApiSecret = rawApiSecret ? rawApiSecret.trim().replace(/^['"]|['"]$/g, '') : '';

  const hasFormattingIssues =
    rawCloudName !== cleanCloudName ||
    rawApiKey !== cleanApiKey ||
    rawApiSecret !== cleanApiSecret;

  console.log(`- Formatting Anomalies (spaces/quotes): ${hasFormattingIssues ? "DETECTED!" : "None detected"}`);

  // Configure SDK
  cloudinary.config({
    cloud_name: cleanCloudName,
    api_key: cleanApiKey,
    api_secret: cleanApiSecret,
    secure: true
  });

  console.log("\n2. TESTING CLOUDINARY ADMIN API (READ OPERATIONS)");
  try {
    const pingResult = await cloudinary.api.ping();
    console.log(`- Admin API Ping: SUCCESS (${JSON.stringify(pingResult)})`);
  } catch (err) {
    console.log(`- Admin API Ping: FAILED -> Status: ${err.http_code}, Message: "${err.message}"`);
  }

  try {
    const usageResult = await cloudinary.api.usage();
    console.log(`- Admin API Usage: SUCCESS (Plan: ${usageResult.plan}, Credits used: ${usageResult.credits?.usage_percent || 0}%)`);
  } catch (err) {
    console.log(`- Admin API Usage: FAILED -> Status: ${err.http_code}, Message: "${err.message}"`);
  }

  console.log("\n3. TESTING CLOUDINARY UPLOAD API (WRITE OPERATION VIA SDK)");
  const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  
  try {
    const uploadRes = await cloudinary.uploader.upload(dummyBase64, {
      public_id: "pandamarket/audit_test_file",
      overwrite: true
    });
    console.log(`- SDK Uploader: SUCCESS! Public ID: ${uploadRes.public_id}, URL: ${uploadRes.secure_url}`);
  } catch (err) {
    console.log(`- SDK Uploader: FAILED!`);
    console.log(`  - HTTP Status: ${err.http_code}`);
    console.log(`  - Message: "${err.message}"`);
    console.log(`  - Full Error Object:`, JSON.stringify(err, null, 2));
  }

  console.log("\n4. DIRECT HTTP REST API TEST (MANUAL SIGNATURE FOR DEEP DIAGNOSTICS)");
  await testDirectRestApi(cleanCloudName, cleanApiKey, cleanApiSecret);
}

function testDirectRestApi(cloudName, apiKey, apiSecret) {
  return new Promise((resolve) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = "pandamarket/audit_rest_test";
    
    // Cloudinary signature parameters must be sorted alphabetically
    // overwrite=true&public_id=pandamarket/audit_rest_test&timestamp=...
    const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const boundary = '----CloudinaryBoundary' + Math.random().toString(16).substring(2);
    
    let body = '';
    body += `--${boundary}\r\nContent-Disposition: form-data; name="file"\r\n\r\ndata:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${publicId}\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\ntrue\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
    body += `--${boundary}--\r\n`;

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    console.log(`- Requesting URL: https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    console.log(`- Calculated Signature: ${signature}`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`- Direct REST Response Code: ${res.statusCode}`);
        console.log(`- Response Headers:`, JSON.stringify(res.headers, null, 2));
        console.log(`- Response Body:`, data);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`- Direct REST Error: ${e.message}`);
      resolve();
    });

    req.write(body);
    req.end();
  });
}

auditCloudinary();
