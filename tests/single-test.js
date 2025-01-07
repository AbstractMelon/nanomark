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

const start = process.hrtime();
finalHtml = parser.parse(markdown);
const end = process.hrtime(start);
let time = end[0] + end[1] / 1000000

console.log(`Time Taken: ${time}ms`);


fs.writeFileSync(
  "output.html",
  `<link rel="stylesheet" href="test-style.css" />\n${finalHtml}`
);
