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

const start = process.hrtime();
const html = parser.parse(markdown);
const end = process.hrtime(start);
console.log(`Time taken to parse markdown: ${end[0]}s ${end[1] / 1000000}ms`);
console.log(html);
