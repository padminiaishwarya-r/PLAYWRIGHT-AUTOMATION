import fs from 'fs';

export default async () => {
  const webVitalsFile = 'test-results/web-vitals.json';

  if (fs.existsSync(webVitalsFile)) {
    fs.unlinkSync(webVitalsFile);
  }

  console.log('Cleared old Web Vitals data');
};
