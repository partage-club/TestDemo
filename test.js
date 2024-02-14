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
  const driver = await remote(wdOpts);
  const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));
  const fs = require('fs');
  await driver.startRecordingScreen();

  //fonction qui attend que le boutton apparait
  async function waitForButton(path) {
    let but;
    while (!but) {
        try {
          but = await driver.$(path);
        } catch (error) {
            // Handle any exceptions if necessary
            console.log("Button not found yet. Retrying...");
        }
    }
    await but.click();
  }

  async function waitForElementDisplayed(xpath) {
    let element = await driver.$(xpath);

    while (!(await element.isDisplayed())) {
        console.log(`Element with XPath ${xpath} is not displayed yet. Retrying...`);
        // Optionally, you can introduce a small delay before retrying
        await driver.pause(500);
    }

    return element;
}

  //Cas de test 1
  try {
    await waitForButton("xpath://android.widget.Button[@content-desc=\"Enter URL manually\"]/android.view.ViewGroup");

    const el2 = await driver.$("class name:android.widget.EditText");
    await el2.click();
   

    await el2.addValue("https://u.expo.dev/update/21b1cdb1-1af9-4ccb-a27c-d26825467f56");
    const el3 = await driver.$("xpath://android.view.ViewGroup[@resource-id=\"DevLauncherMainScreen\"]/android.view.ViewGroup");
    await el3.click();
    const conn = await driver.$("accessibility id:Connect");
    await conn.click();


    //const screenshotBefore = await driver.takeScreenshot();
    //fs.writeFileSync('screenshot_before.png', screenshotBefore, 'base64');


    // Example usage
    //const bouttonX = await waitForElementDisplayed("xpath://android.widget.FrameLayout[@resource-id=\"club.partage.mobile.development:id/bottom_sheet\"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.ImageView");
    //await bouttonX.click();
  
    //const el1 = await driver.$("xpath://android.widget.FrameLayout[@resource-id=\"club.partage.mobile.development:id/bottom_sheet\"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.ImageView");    
    console.log("reussi");
  } 
  catch (error) {
    console.error(error.message);
    console.log("pass reussi");
  }
  finally{
    const videoData = await driver.stopRecordingScreen();
    fs.writeFileSync('recording.mp4', videoData, 'base64');
  }
}

runTest().catch(console.error);
