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

  //Cas de test 1
  try {
    await waitForButton("xpath://android.widget.Button[@content-desc=\"Enter URL manually\"]/android.view.ViewGroup");

    const el2 = await driver.$("class name:android.widget.EditText");
    await el2.click();
   

    await el2.addValue("https://u.expo.dev/update/21b1cdb1-1af9-4ccb-a27c-d26825467f56");
    await driver.executeScript("mobile: pressKey", [{"keycode":4}]);
      
    const el3 = await driver.$("xpath://android.widget.TextView[@text=\"Connect\"]");
    el3.click();
    

    const screenshotBefore = await driver.takeScreenshot();
    fs.writeFileSync('screenshot_before.png', screenshotBefore, 'base64');
    await waitForButton("xpath://android.widget.FrameLayout[@resource-id=\"club.partage.mobile.development:id/bottom_sheet\"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.ImageView");
      
    console.log("reussi");
  } 
  catch (error) {
    console.error(error.message);
    console.log("pass reussi");
  }
  finally{
    const videoData = await driver.stopRecordingScreen();

    // Save the video data to a file
    fs.writeFileSync('recording.mp4', videoData, 'base64');
  }
}

runTest().catch(console.error);
