import fs from "fs";

export function generateFeatureSummary(jsonPath) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const features = {};
  const failedScreenshots = [];

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalFlaky = 0;

  let totalDuration = data.stats?.duration
    ? Math.round(data.stats.duration / 1000)
    : 0;

  let device = "Unknown Device";
  try {
    const firstSuite = data.suites[0];
    const firstGroup = firstSuite.suites?.[0];
    const firstSpec = firstGroup?.specs?.[0];
    const firstTest = firstSpec?.tests?.[0];
    const browser = firstTest?.results?.[0]?.projectName;
    if (browser) device = browser;
  } catch (e) {
    device = "Unknown";
  }

  data.suites.forEach(suite => {
    suite.suites?.forEach(inner => {
      const featureName = inner.title.trim();
      if (!features[featureName]) {
        features[featureName] = {
          total: 0,
          pass: 0,
          fail: 0,
          flaky: 0
        };
      }

      inner.specs.forEach(spec => {
        spec.tests.forEach(test => {
          const status = test.results[0]?.status;
          features[featureName].total++;
          totalTests++;
          if (status === "passed") {
            features[featureName].pass++;
            totalPassed++;
          } else if (status === "flaky") {
            features[featureName].flaky++;
            totalFlaky++;
            features[featureName].fail++; 
            totalFailed++;
          } else {
            features[featureName].fail++;
            totalFailed++;
            test.results.forEach(r => {
              r.attachments?.forEach(att => {
                if (att.name === "screenshot" && att.path) {
                  failedScreenshots.push(att.path);
                }
              });
            });
          }
        });
      });
    });
  });

  const overallPassPercent = ((totalPassed / totalTests) * 100).toFixed(2);
  const overallFailPercent = (((totalFailed + totalFlaky) / totalTests) * 100).toFixed(2);

  return {
    features,
    failedScreenshots,
    device,
    totalDuration,
    totalTests,
    totalPassed,
    totalFailed,
    totalFlaky,
    overallPassPercent,
    overallFailPercent
  };
}
