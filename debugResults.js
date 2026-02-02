import { readFileSync } from "fs";
console.log(JSON.stringify(JSON.parse(readFileSync("./playwright-results.json","utf8")), null, 2));
