class Nanomark {
  constructor() {
    this.patterns = {
      heading: /^(#{1,6})\s+(.+)$/gm,
      bold: /\*\*(.+?)\*\*/g,
      italic: /\*(.+?)\*/g,
      link: /\[(.+?)\]\((.+?)\)/g,
      listItem: /^([-*+]|\d+\.)\s+(.+)$/gm,
      blockquote: /^>\s+(.+)$/gm,
      code: /`([^`]+)`/g,
      codeBlock: /```([\s\S]+?)```/g,
      paragraph: /^(?![-*+]|^\d+\.|>|#{1,6}\s|```)[^\n]+$/gm,
    };
  }

  parse(markdown) {
    let html = markdown.replace(/\r\n/g, "\n");

    // Escape HTML once at the start to prevent injection
    html = this.escapeHtml(html);

    // Process elements in a logical order to minimize interference
    html = html
      .replace(
        this.patterns.codeBlock,
        (_, code) => `<pre><code>${code.trim()}</code></pre>`
      )
      .replace(this.patterns.code, (_, code) => `<code>${code}</code>`)
      .replace(this.patterns.heading, (_, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content.trim()}</h${level}>`;
      })
      .replace(
        this.patterns.blockquote,
        (_, content) => `<blockquote>${content.trim()}</blockquote>`
      )
      .replace(this.patterns.link, '<a href="$2">$1</a>')
      .replace(this.patterns.bold, "<strong>$1</strong>")
      .replace(this.patterns.italic, "<em>$1</em>");

    // Process lists (unordered and ordered)
    html = this.processLists(html);

    // Process paragraphs
    html = html.replace(
      this.patterns.paragraph,
      (match) => `<p>${match.trim()}</p>`
    );

    // Remove redundant newlines
    html = html.replace(/\n{2,}/g, "\n");

    return html.trim();
  }

  processLists(text) {
    return text.replace(
      /(?:^|\n)([-*+]\s.+|\d+\.\s.+)(?:\n|$)/gm,
      (match, list) => {
        const isOrdered = /^\d+\./.test(list);
        const tag = isOrdered ? "ol" : "ul";

        const items = list
          .split("\n")
          .filter((item) => item.trim())
          .map((item) => {
            const content = item.replace(/^([-*+]|\d+\.)\s+/, "");
            return `<li>${content.trim()}</li>`;
          })
          .join("");

        return `<${tag}>${items}</${tag}>`;
      }
    );
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
