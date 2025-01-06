const fs = require("fs");
const Nanomark = require("../src/main.js");
const parser = new Nanomark();

const markdown = `
# Hello World

This is a **bold** and *italic* text.

- List item 1
- List item 2

1. Ordered item 1
2. Ordered item 2

> This is a blockquote

\`inline code\`

\`\`\`
code block
\`\`\`

[Link text](https://example.com)

| Foo | Bar | Baz |
| 1   | 2   | 3   |
| 4   | 5   | 6   |
| 7   | 8   | 9   |
`;

const numTests = 100000;
const results = [];

let finalHtml = "";

for (let i = 0; i < numTests; i++) {
  const start = process.hrtime();
  finalHtml = parser.parse(markdown);
  const end = process.hrtime(start);
  results.push(end[0] + end[1] / 1000000);
}

const min = Math.min(...results);
const max = Math.max(...results);
const sum = results.reduce((acc, val) => acc + val, 0);
const avg = sum / results.length;

console.log(`Best time: ${min}ms`);
console.log(`Worst time: ${max}ms`);
console.log(`Average time: ${avg}ms`);
console.log(`Tests run: ${numTests}`);

fs.writeFileSync(
  "output.html",
  `<link rel="stylesheet" href="test-style.css" />\n${finalHtml}`
);
