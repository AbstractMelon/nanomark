const fs = require("fs");
const path = require("path")
const Nanomark = require("../src/main.js");
const parser = new Nanomark();

console.log(__dirname)
const markdown = fs.readFileSync(path.resolve("./README.md"), "utf-8");

const numTests = 100000;
const results = [];

let finalHtml = "";

const start = process.hrtime();
finalHtml = parser.parse(markdown, {
  header_ids: false
});
const end = process.hrtime(start);
let time = end[0] + end[1] / 1000000

console.log(`Time Taken: ${time}ms`);


fs.writeFileSync(
  path.resolve("./web/docs/index.html"),
  `<link rel="stylesheet" href="test-style.css" />\n${finalHtml}`
);
