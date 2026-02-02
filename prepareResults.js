import fs from "fs";
const folder = "./test-results";
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
  console.log("test-results directory created");
} else {
  console.log("test-results directory already exists");
}
