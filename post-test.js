import { execSync } from "child_process";
import fs from "fs";

await new Promise(r => setTimeout(r, 1000));

if (!fs.existsSync("./test-results/test-results.json")) {
  console.error("No JSON found! Reporter failed.");
  process.exit(1);
}

console.log("Sending Playwright summary email...");
execSync("node sendReportWithSummary.js", { stdio: "inherit" });
console.log("Checking JSON file...");
console.log(fs.existsSync("./test-results/test-results.json"));
console.log(fs.readFileSync("./test-results/test-results.json", "utf-8").slice(0, 200)); 
