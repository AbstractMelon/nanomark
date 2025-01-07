const { fork } = require("child_process");

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

const numTests = 10;

function runBenchmark(parserType) {
  return new Promise(async (resolve) => {
    const results = [];

    for (let i = 0; i < numTests; i++) {
      const child = fork(__filename, [parserType]);
      child.send({ markdown });
      await new Promise((testResolve) => {
        child.on("message", (result) => {
          results.push(result.time);
          testResolve();
        });
      });
      child.kill();
    }

    const min = Math.min(...results);
    const max = Math.max(...results);
    const avg = results.reduce((acc, val) => acc + val, 0) / results.length;

    console.log(`${parserType}:`);
    console.log(`Best time: ${min.toFixed(6)}ms`);
    console.log(`Worst time: ${max.toFixed(6)}ms`);
    console.log(`Average time: ${avg.toFixed(6)}ms`);
    console.log(`Tests run: ${numTests}`);
    resolve();
  });
}

if (process.argv.length > 2) {
  const parserType = process.argv[2];
  const parsers = {
    Nanomark: () => {
      const Nanomark = require("nanomark");
      const parser = new Nanomark();
      return (md) => parser.parse(md);
    },
    Marked: () => {
      const marked = require("marked");
      return (md) => marked.parse(md);
    },
    Showdown: () => {
      const showdown = require("showdown");
      const converter = new showdown.Converter();
      return (md) => converter.makeHtml(md);
    },
  };

  const parserFunction = parsers[parserType]();

  const start = process.hrtime();
  parserFunction(markdown);
  const end = process.hrtime(start);
  const time = end[0] * 1000 + end[1] / 1e6; // Convert to milliseconds

  process.send({ time });
  process.exit();
} else {
  (async () => {
    await runBenchmark("Nanomark");
    await runBenchmark("Marked");
    await runBenchmark("Showdown");
    console.log("Benchmarking complete.");
  })();
}
