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

const html = parser.parse(markdown);
console.log(html);
