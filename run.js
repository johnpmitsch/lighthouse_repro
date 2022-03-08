const fs = require('fs')
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const reportGenerator = require('lighthouse/report/generator/report-generator.js');
const lighthouseConfig = require('./lighthouse_config')

const puppeteerOptions = {
  // Uncomment to see chromium
  headless: false,
  defaultViewport: null,
};

(async() => {
  // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
  console.log(`Launching chrome`)
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  const timeout = 60 * 1000; //ms
  page.setDefaultNavigationTimeout(timeout)
  page.setDefaultTimeout(timeout)

	// Run lighthouse report and record results
	const lighthouseOptions = { port: (new URL(browser.wsEndpoint())).port }
	const { lhr } = await lighthouse(`https://news.ycombinator.com/`, lighthouseOptions, lighthouseConfig);
	const json = reportGenerator.generateReport(lhr, 'json');
	const html = reportGenerator.generateReport(lhr, 'html');

	const dir = ".lighthouseci/"
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	const jsonFile = `${dir}/lhr-${Date.now()}.json`
	const htmlFile = `${dir}/lhr-${Date.now()}.html`
	fs.writeFileSync(jsonFile, json);
	fs.writeFileSync(htmlFile, html);
	console.log(`Lighthouse report saved in: \nJSON: ${jsonFile}\nHTML: ${htmlFile}`)

	await browser.close();
})();