const Nanomark = require("nanomark");
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
`;

const numTests = 100000;
const results = [];

for (let i = 0; i < numTests; i++) {
  const start = process.hrtime();
  const html = parser.parse(markdown);
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
