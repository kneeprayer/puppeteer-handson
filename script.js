const fs = require('fs');
const assert = require('assert');
const puppeteer = require('puppeteer');

(async() => {
  // argsを明示
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://github.com/kneeprayer');
  await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
  await page.screenshot({path: './img/screenshot.png'});

  browser.close();
  assert(fs.existsSync('./img/screenshot.png'));
  console.log('Getting screenshot was Succeeded.🎉 ');
})();
