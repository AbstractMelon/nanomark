class Nanomark {
  constructor() {
    // Pre-compile regex patterns for better performance
    this.patterns = {
      heading: /^(#{1,6})\s+(.+)$/gm,
      bold: /\*\*(.+?)\*\*/g,
      italic: /\*(.+?)\*/g,
      link: /\[(.+?)\]\((.+?)\)/g,
      listItem: /^[-*+]\s+(.+)$/gm,
      orderedList: /^\d+\.\s+(.+)$/gm,
      blockquote: /^>\s+(.+)$/gm,
      code: /`(.+?)`/g,
      codeBlock: /```([^`]+)```/g,
      paragraph: /^(?![-*+]|\d+\.|>|#{1,6}\s|```)[^\n]+$/gm,
    };
  }

  parse(markdown) {
    // Remove carriage returns and normalize line endings
    let html = markdown.replace(/\r\n/g, "\n");

    // Process code blocks first to prevent interference
    html = html.replace(this.patterns.codeBlock, (_, code) => {
      return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Process inline code
    html = html.replace(this.patterns.code, (_, code) => {
      return `<code>${this.escapeHtml(code)}</code>`;
    });

    // Process headings
    html = html.replace(this.patterns.heading, (_, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content.trim()}</h${level}>`;
    });

    // Process blockquotes
    html = html.replace(this.patterns.blockquote, (_, content) => {
      return `<blockquote>${content.trim()}</blockquote>`;
    });

    // Process lists
    html = this.processLists(html);

    // Process bold
    html = html.replace(this.patterns.bold, "<strong>$1</strong>");

    // Process italic
    html = html.replace(this.patterns.italic, "<em>$1</em>");

    // Process links
    html = html.replace(this.patterns.link, '<a href="$2">$1</a>');

    // Process paragraphs
    html = html.replace(this.patterns.paragraph, (match) => {
      return `<p>${match.trim()}</p>`;
    });

    // Clean up multiple newlines
    html = html.replace(/\n{2,}/g, "\n");

    return html.trim();
  }

  processLists(text) {
    // Process unordered lists
    let html = text.replace(/(?:(^|\n)[-*+]\s+[^\n]+)+/g, (match) => {
      const items = match.split("\n").filter((item) => item.trim());
      const listItems = items
        .map((item) => {
          const content = item.replace(/^[-*+]\s+/, "");
          return `<li>${content.trim()}</li>`;
        })
        .join("");
      return `<ul>${listItems}</ul>`;
    });

    // Process ordered lists
    html = html.replace(/(?:(^|\n)\d+\.\s+[^\n]+)+/g, (match) => {
      const items = match.split("\n").filter((item) => item.trim());
      const listItems = items
        .map((item) => {
          const content = item.replace(/^\d+\.\s+/, "");
          return `<li>${content.trim()}</li>`;
        })
        .join("");
      return `<ol>${listItems}</ol>`;
    });

    return html;
  }

  escapeHtml(text) {
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
}

module.exports = Nanomark;
