const Nanomark = require("nanomark");
const marked = require("marked"); // Popular markdown library
const showdown = require("showdown"); // Another popular markdown library
const converter = new showdown.Converter();

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

const numTests = 1000;

function benchmark(parserFunction) {
  const results = [];
  for (let i = 0; i < numTests; i++) {
    const start = process.hrtime();
    parserFunction(markdown);
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
}

console.log("Nanomark:");
benchmark((md) => parser.parse(md));

console.log("Marked:");
benchmark((md) => marked.parse(md));

console.log("Showdown:");
benchmark((md) => converter.makeHtml(md));
