class Nanomark {
  constructor() {
    this.patterns = {
      heading: /^(#{1,6})\s+(.+)$/gm,
      bold: /\*\*(.+?)\*\*/g,
      italic: /\*(.+?)\*/g,
      link: /\[(.+?)\]\((.+?)\)/g,
      listItem: /^([-*+]|\d+\.)\s+(.+)$/gm,
      blockquote: /^>\s+(.+)$/gm,
      code: /`([^`]+)`/g,
      codeBlock: /```([\s\S]+?)```/g,
      paragraph: /^(?![-*+]|^\d+\.|>|#{1,6}\s|```)[^\n]+$/gm,
      table: /^(?:\|(.+?)\|(?:\n|$))+$/gm,
    };
  }

  /**
 * Parses the given markdown string into HTML.
 * @param {string} markdown The markdown content to parse.
 * @param {Object} config The configuration options.
 * @param {boolean} [config.header_ids] Adds ID attributes to header elements. Converts headers to kebab-case. (Experimental)
 * @returns {string} The HTML output of the parsed markdown.
 */
  parse(markdown, config) {
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
        const trimmed = content.trim()
        const assignedId = config?.header_ids?this.kebabCase(trimmed):""
        return `<h${level} id="${assignedId}">${trimmed}</h${level}>`;
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

    // Process tables
    html = this.processTables(html);

    // Process paragraphs for text blocks that aren't already wrapped
    html = html.replace(this.patterns.paragraph, (match) => {
      // Check if the match is already wrapped in a block-level tag
      if (
        /^(<h[1-6]|<ul|<ol|<li|<blockquote|<code|<pre|<table|<tr|<th|<td|<a|<strong|<em|<p)/.test(
          match
        )
      ) {
        return match; // Leave it untouched
      }
      return `<p>${match.trim()}</p>`;
    });

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
            const content = item.replace(/^([-*+]|\d+\.)\s+/, "");
            return `<li>${content.trim()}</li>`;
          })
          .join("");

        return `<${tag}>${items}</${tag}>`;
      }
    );
  }

  processTables(text) {
    return text.replace(this.patterns.table, (table) => {
      const rows = table.trim().split("\n");
      const htmlRows = rows.map((row, index) => {
        const cells = row.split("|").filter((cell) => cell.trim());
        const tag = index === 0 ? "th" : "td";

        return `<tr>${cells
          .map((cell) => `<${tag}>${cell.trim()}</${tag}>`)
          .join("")}</tr>`;
      });

      return `<table>${htmlRows.join("")}</table>`;
    });
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

  kebabCase(string){
    return string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}

module.exports = Nanomark;
