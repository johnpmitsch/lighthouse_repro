const Gatherer = require('lighthouse').Gatherer;
const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
 
async function connect(driver) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await driver.wsEndpoint(),
    defaultViewport: null,
  });
  const {targetInfo} = await driver.sendCommand('Target.getTargetInfo');
  const puppeteerTarget = (await browser.targets())
    .find(target => target._targetId === targetInfo.targetId);
  const page = await puppeteerTarget.page();
  return {browser, page, executionContext: driver.executionContext};
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

class DashboardGatherer extends Gatherer {
  async pass(options) {
    const {driver} = options;
    const {page} = await connect(driver);
    page.setCacheEnabled(false) // disable cache

    console.log("starting")

		const classLinkVisibleStart = performance.now();
		try {
			await page.reload() // reload the page
			await page.waitForFunction(
				'document.querySelector("tbody > tr:nth-child(1) > td:nth-child(3) > a")?.innerText?.length > 1'
			)
		} catch (e) {
			console.log(e)
		}
		// Class link is loaded, end timer
		const classLinkVisibleEnd = performance.now();
		return { value: classLinkVisibleEnd - classLinkVisibleStart }
  }
}
 
 module.exports = DashboardGatherer;