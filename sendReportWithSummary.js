import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { generateFeatureSummary } from "./reportSummary.js";
import { sendGChatReport } from "./utils/gchatNotifier.js";

dotenv.config();

/* ---------- DATE / TIME ---------- */
const today = new Date().toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/* ---------- EXECUTION SUMMARY ---------- */
const summary = generateFeatureSummary("./test-results/test-results.json");

const {
  features,
  failedScreenshots,
  device,
  totalDuration,
  totalTests,
  totalPassed,
  totalFailed,
  totalFlaky,
  overallPassPercent,
  overallFailPercent,
} = summary;

/* ---------- WEB VITALS STATUS ---------- */
let vitalsStatus = "✅ No Web Vitals regressions detected";

if (fs.existsSync("test-results/web-vitals.json")) {
  const vitals = JSON.parse(
    fs.readFileSync("test-results/web-vitals.json", "utf-8")
  );

  const badVitals = vitals.filter(v => v.cls > 1.5 || v.lcp > 15000);

  if (badVitals.length > 0) {
    vitalsStatus = `⚠️ ${badVitals.length} Web Vitals regression(s) detected`;
  }
}

/* ---------- WEB VITALS HTML ---------- */
function getWebVitalsHTML() {
  const vitalsFile = path.resolve("test-results/web-vitals.json");

  if (!fs.existsSync(vitalsFile)) {
    return `<p style="font-family:Arial;">No Web Vitals collected.</p>`;
  }

  const vitals = JSON.parse(fs.readFileSync(vitalsFile, "utf-8"));

  let vitalsRows = "";
  for (const v of vitals) {
    vitalsRows += `
      <tr>
        <td>${v.testName}</td>
        <td><a href="${v.url}" target="_blank">Open</a></td>
        <td>${v.lcp} ms</td>
        <td>${v.cls}</td>
        <td>${v.inp ?? "NA"} ms</td>
      </tr>
    `;
  }

  return `
  <h3 style="font-family:Arial;">📊 Web Vitals Report</h3>
  <table border="1" cellpadding="8" cellspacing="0"
         style="border-collapse:collapse;width:95%;margin:auto;font-family:Arial;text-align:center;">
    <tr style="background:#222;color:white;font-weight:bold;">
      <th>TEST</th>
      <th>URL</th>
      <th>LCP</th>
      <th>CLS</th>
      <th>INP</th>
    </tr>
    ${vitalsRows}
  </table>
  `;
}

/* ---------- FEATURE TABLE ---------- */
let rows = "";

// ---- Feature rows ----
for (const feature in features) {
  const f = features[feature];

  rows += `
    <tr>
      <td>${feature}</td>
      <td>${f.total}</td>
      <td>${f.pass}</td>
      <td>${f.flaky}</td>
      <td>${f.fail - f.flaky}</td>
    </tr>
  `;
}

// ---- ONE overall percentage row ----
rows += `
  <tr style="font-weight:bold;background:#d9edf7;">
    <td>Percentage</td>
    <td>100%</td>
    <td>${overallPassPercent}%</td>
    <td>${((totalFlaky / totalTests) * 100).toFixed(2)}%</td>
    <td>${overallFailPercent}%</td>
  </tr>
`;

/* ---------- EMAIL HTML ---------- */
const html = `
<h2 style="font-family:Arial;text-align:center;">
International Website Automation & Performance Summary
</h2>

<p style="font-family:Arial;">
<b>Device / Browser:</b> ${device}<br/>
<b>Total Execution Time:</b> ${totalDuration} sec<br/>
<b>Web Vitals Status:</b> ${vitalsStatus}
</p>

<table border="1" cellpadding="8" cellspacing="0"
      style="border-collapse:collapse;width:90%;margin:auto;font-family:Arial;text-align:center;">
 <tr style="background:#3b6ea5;color:white;font-weight:bold;">
   <th>FEATURE</th>
   <th style="background:#f2e86d;">TOTAL</th>
   <th style="background:#8ed18f;">PASS</th>
   <th style="background:#f5a623;">FLAKY</th>
   <th style="background:#e48080;">FAIL</th>
 </tr>
 ${rows}
</table>

${getWebVitalsHTML()}

<h3 style="font-family:Arial;">📎 Failed Test Screenshots</h3>
<p style="font-family:Arial;">Attached only for failed cases.</p>
`;

/* ---------- EMAIL ATTACHMENTS ---------- */
const attachments = failedScreenshots.map(p => ({
  filename: p.split("/").pop(),
  path: p,
}));

/* ---------- EMAIL SETUP ---------- */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
});

/* ---------- SEND EMAIL ---------- */
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  // to: [
  //   "padminiaishwarya.r@caratlane.com",
  //   "thiyaga-all@caratlane.com",
  //   "product@caratlane.com",
  //   "sundar.g@caratlane.com",
  //   "snehal.s@caratlane.com",
  // ],
  to: "padminiaishwarya.r@caratlane.com",
  subject: `International Live Automation Execution Summary - ${today}`,

  text: `
International Automation Execution Summary

Total Tests : ${totalTests}
Passed      : ${totalPassed}
Failed      : ${totalFailed}
Flaky       : ${totalFlaky}

Web Vitals: ${vitalsStatus}

Please view this email on desktop for the detailed report.
  `,

  html,
  attachments,
});

console.log("✅ Email sent successfully");

/* ---------- GOOGLE CHAT ---------- */
await sendGChatReport({
  total: totalTests,
  passed: totalPassed,
  failed: totalFailed,
  flaky: totalFlaky,
  vitalsStatus,
});

console.log("✅ Email + Google Chat notification completed");
