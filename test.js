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
    const el12 = await driver.$("xpath://android.widget.Button[@content-desc=\"Enter URL manually\"]/android.view.ViewGroup");
    await el12.click();
    await wait(5000);

    const el13 = await driver.$("class name:android.widget.EditText");
    await el13.click();
    await wait(5000);

    await el13.addValue("https://u.expo.dev/update/21b1cdb1-1af9-4ccb-a27c-d26825467f56");
    await wait(5000);

    await driver.executeScript("mobile: pressKey", [{ "keycode": 4 }]);
    await wait(5000);
    const el14 = await driver.$("accessibility id:Connect");
    await el14.click();
    await wait(5000);
    const el3 = await driver.$("xpath://android.widget.FrameLayout[@resource-id=\"club.partage.mobile.development:id/bottom_sheet\"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.ImageView");
    await el3.click();
    console.log("reussi");
  } 
  catch (error) {
    console.error(error.message);
    console.log("pas reussi");
  }
}


runTest().catch(console.error);
