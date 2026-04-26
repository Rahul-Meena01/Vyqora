import { useCallback, useMemo } from "react";
import { renderMarkdown } from "../utils/markdown";

const getWikiLink = (target) => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest(".wikilink");
};

export default function MarkdownPreview({ content, onWikiLinkClick }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  const onClick = useCallback((event) => {
    const link = getWikiLink(event.target);
    if (!link) {
      return;
    }

    onWikiLinkClick(link.dataset.title || "");
  }, [onWikiLinkClick]);

  const onKeyDown = useCallback((event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const link = getWikiLink(event.target);
    if (!link) {
      return;
    }

    event.preventDefault();
    onWikiLinkClick(link.dataset.title || "");
  }, [onWikiLinkClick]);

  return (
    <div
      className="preview markdown"
      onClick={onClick}
      onKeyDown={onKeyDown}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
