import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('test-results/web-vitals.json');

export function saveWebVitals(spec, testName, url, vitals) {
  let data = [];

  if (fs.existsSync(FILE_PATH)) {
    data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
  }

  data.push({
    spec,
    testName,
    url,
    lcp: vitals.lcp,
    cls: vitals.cls,
    inp: vitals.inp ?? 'NA',
    time: new Date().toLocaleString('en-IN')
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}
