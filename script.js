const fs = require('fs');
const assert = require('assert');
const puppeteer = require('puppeteer');

// input your own information.
const myUsername = 'myUsername';
const myPassword = 'myPassword';

Date.prototype.yyyymmddhhmmss = function() {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "".concat(yyyy).concat(mm).concat(dd).concat('_').concat(hh).concat(min).concat(ss);
   };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

(async() => {
  // if headless: true is setted, login will be fail.
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // config browser size
  await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
  // go to AWS console
  await page.goto('https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fconsole.aws.amazon.com%2Fconsole%2Fhome%3Fstate%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fhomepage&forceMobileApp=0');
  await page.focus('#resolving_input');
  // input username
  await page.type(myUsername, {delay: 10});
  await page.click('#next_button');
  await page.waitForNavigation();
  // input password
  await page.focus('#ap_password');
  await page.type(myPassword, {delay: 10});
  await page.click('#signInSubmit-input');
  await page.waitForNavigation();
  // goto cloudwatch metrics (please input your own url)
  await page.goto('https://ap-northeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-1#metricsV2:');
  await sleep(3000);
  // await page.waitForNavigation(); <- it doesn't work on this url(SPA site)

  // set filename
  const fileName1 = './img/cloudwatch_screenshot_' + (new Date()).yyyymmddhhmmss() + '.png';
  // take a screenshot
  await page.screenshot({ path: fileName1, fullPage: true });
  // check file
  assert(fs.existsSync(fileName1));
  
  // goto ec2 instance console (please input your own url)
  await page.goto('https://ap-northeast-1.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-1#Instances:sort=instanceId');
  await sleep(3000);
  // await page.waitForNavigation(); <- it doesn't work on this url(SPA site)

  // set filename
  const fileName2 = './img/ec2_screenshot_' + (new Date()).yyyymmddhhmmss() + '.png';
  // take a screenshot
  await page.screenshot({ path: fileName2, fullPage: true });
  // check file
  assert(fs.existsSync(fileName2));

  // close browser
  browser.close();

  // print a message.
  console.log('Getting screenshot was Succeeded.🎉 ');
})();
