const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const inline = (text) => {
  let html = escapeHtml(text);

  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  html = html.replace(
    /\[\[([^\]]+)\]\]/g,
    '<span class="wikilink" role="button" tabindex="0" aria-label="Open note $1" data-title="$1">$1</span>',
  );
  html = html.replace(
    /(^|\s)#([a-zA-Z0-9_-]+)/g,
    '$1<span class="tag-chip">#$2</span>',
  );

  return html;
};

export const renderMarkdown = (source = "") => {
  const text = typeof source === "string" ? source : "";
  const lines = text.split("\n");
  const out = [];

  let inCode = false;
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        out.push('<pre class="md-code-block"><code>');
      } else {
        out.push("</code></pre>");
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      out.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push("<hr />");
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("> ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(listItem[1])}</li>`);
      continue;
    }

    if (inList) {
      out.push("</ul>");
      inList = false;
    }

    if (!line.trim()) {
      out.push("<br />");
      continue;
    }

    out.push(`<p>${inline(line)}</p>`);
  }

  if (inList) {
    out.push("</ul>");
  }

  if (inCode) {
    out.push("</code></pre>");
  }

  return out.join("");
};
