const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('BROWSER PAGE EXCEPTION:', error.message);
    console.log('STACK TRACE:', error.stack);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  console.log("Navigating to http://localhost:3000/categories/produce...");
  try {
    await page.goto('http://localhost:3000/categories/produce', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (err) {
    console.log("Navigation ended/timed out:", err.message);
  }

  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
  console.log("Test finished.");
})();
