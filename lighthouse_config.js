// This is the basic desktop settings that we can use for screen size and some basic throttling
const lhDesktopConfig = require('lighthouse/lighthouse-core/config/lr-desktop-config.js')

module.exports = {
  // 1. Run your custom tests along with all the default Lighthouse tests.
  extends: 'lighthouse:default',

  // 2. Add gatherer to the default Lighthouse load ('pass') of the page.
  passes: [{
    passName: 'defaultPass',
    gatherers: [
      'dashboard-gatherer',
    ],
  }],

  // 3. Add custom audit to the list of audits 'lighthouse:default' will run.
  audits: [
    'dashboard-audit',
  ],

  // 4. Create a new 'My site metrics' section in the default report for our results.
  categories: {
    Forum: {
      title: 'Forum Metrics',
      description: 'Custom metrics for Forum',
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        {id: 'dashboard-audit', weight: 1},
      ],
    },
  },
  settings: {
    formFactor: "desktop", // tells lighthouse to evaluate as desktop
    screenEmulation: { disabled: true }, // don't emulate mobile or resized screen
    // The performance scores are really long when custom 'Forum' audit is included, not sure why
    onlyCategories: ['Forum', 'performance'], // can add more categories like 'accessibility' here
    emulatedUserAgent: lhDesktopConfig.settings.emulatedUserAgent,
  }
};