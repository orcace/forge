import type { JSX } from "react";
import { useMemo } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { slugifyHeading } from "./docs.toc";

interface DocsMarkdownProps {
  markdown: string;
}

export function DocsMarkdown({ markdown }: DocsMarkdownProps): JSX.Element {
  const html = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(withHeadingIds(markdown), { async: false }));
  }, [markdown]);

  return (
    <article
      className="forge-markdown docs-markdown min-w-0 max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function withHeadingIds(markdown: string): string {
  return markdown.replace(/^(#{2,3})\s+(.+)$/gm, (_match, hashes, title: string) => {
    const level = String(hashes).length;
    const id = slugifyHeading(title);

    return `<h${level} id="${id}">${title}</h${level}>`;
  });
}
