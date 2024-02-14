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
  //Cas de test 1
  try {

    await waitForButton("xpath://android.widget.Button[@content-desc=\"Enter URL manually\"]/android.view.ViewGroup");

    const el2 = await driver.$("class name:android.widget.EditText");
    await el2.click();
   

    await el2.addValue("https://u.expo.dev/update/21b1cdb1-1af9-4ccb-a27c-d26825467f56");
    driver.hideKeyboard();

    //clicker sur connect
    const conn = await driver.$("accessibility id:Connect");
    await conn.click();

    await driver.waitUntil(async () => {
      try {
        const button = await driver.$("xpath://android.widget.FrameLayout[@resource-id=\"club.partage.mobile.development:id/bottom_sheet\"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.ImageView");
        if (await button.isExisting()) {
          await button.click();
          console.log("button X found")
          return true; // Exit the wait loop after clicking the button
        }
      } catch (error) {
        console.log("Button X not found yet. Retrying...");
      }
      return false;
    }, { timeout: 90000, timeoutMsg: 'Button X did not appear within 90s' });

    //on attend que la page est loaded en verifiant si un certain header est apparu
    await driver.waitUntil(async () => {
      try {
        const needsHeader = await driver.$("accessibility id:Needs");
        if (await needsHeader.isDisplayed()) {
          console.log("NeedsHeader found");
          return true; // Exit the wait loop after clicking the button
        }
      } catch (error) {
        console.log("NeedsHeader not found yet. Retrying...");
      }
      return false;
    }, { timeout: 90000, timeoutMsg: 'NeedsHeader did not appear within 90s' });
  
  

    //Pour prendre des screenshot (si on veux les save faut ajouter le path .png dans YAML)
    //const screenshotBefore = await driver.takeScreenshot();
    //fs.writeFileSync('screenshot_before.png', screenshotBefore, 'base64');
    console.log("Test reussi");
  } 
  catch (error) {
    console.error(error.message);
    console.log("Test pas reussi");
  }
  finally{
    const videoData = await driver.stopRecordingScreen();
    fs.writeFileSync('recording.mp4', videoData, 'base64');
  }
}

runTest().catch(console.error);
