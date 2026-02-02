import fs from 'fs';

const FILE = './test-results/web-vitals.json';

export function saveWebVitals(testName, url, vitals) {
  let data = [];

  if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  }

  data.push({
    testName,
    url,
    ...vitals,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
