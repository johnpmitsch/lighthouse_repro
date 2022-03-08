const Audit = require('lighthouse').Audit;

class DashboardAudit extends Audit {
  static get meta() {
    return {
      id: 'dashboard-audit',
      title: 'Assignments load on main dashboard page',
      failureTitle: 'Assignments loaded on main dashboard page slowly',
      description: 'Timing how long the next class takes to show on the main dashboard page',
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,

      // The name of the custom gatherer class that provides input to this audit.
      requiredArtifacts: ['DashboardGatherer'],
    };
  }


  static audit(artifacts) {
    const value = artifacts.DashboardGatherer.value;
    console.log(value)

    const score = Audit.computeLogNormalScore(
      {p10: 3000, median: 4000},
      value
    );

    return {
      score: score,
      numericValue: value,
      rawValue: value,
      numericUnit: 'millisecond',
      displayValue: `${value} ms`,
    };
  }
}

module.exports = DashboardAudit;
