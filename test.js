const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'club.partage.mobile.development',
  'appium:appActivity': '.MainActivity',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || '0.0.0.0',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));
  const driver = await remote(wdOpts);
  try {
      const el1 = await driver.$("xpath://android.widget.Button[@content-desc=\"Enter URL manually\"]/android.view.ViewGroup");
      await el1.click();
      await wait(5000);
      const el2 = await driver.$("class name:android.widget.EditText");
      await el2.click();
      await wait(5000);

      await el2.addValue("https://u.expo.dev/update/21b1cdb1-1af9-4ccb-a27c-d26825467f56");
      await driver.executeScript("mobile: pressKey", [{"keycode":4}]);
      await wait(5000);

      const el3 = await driver.$("xpath://android.widget.TextView[@text=\"Connect\"]");
      await el3.click();
      await wait(5000);
      await driver.touchAction({
        action: 'tap', x: 1027, y: 1043
      });
      await wait(5000);
      console.log("pas reussi");
  } 
  catch (error) {
    console.error(error.message);
    console.log("pas reussi");
  }
}


runTest().catch(console.error);
