/**
 * Admonition callouts for project writeups — `:::note`, `:::tip`, `:::info`,
 * `:::example`, `:::quote`, optionally `{collapsible}` for a `<details>`.
 *
 * Built on `remark-directive`'s container directive (`:::name ... :::`)
 * instead of mkdocs' own `!!!`/`???` indentation syntax: that syntax's body is
 * indented four spaces at the document root, which CommonMark reads as an
 * indented code block rather than markdown, so any bold text, links, or
 * fenced code inside it comes out as literal, un-rendered text. A directive's
 * body sits at zero indentation and parses as ordinary markdown.
 *
 * A directive with an unrecognised name (or a leaf/text directive, `::name`
 * or `:name`) is left untouched — only a known, container form is rewritten.
 */
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Plugin } from "unified";

const ADMONITION_TYPES = new Set([
  "note",
  "tip",
  "info",
  "example",
  "quote",
]);

const DEFAULT_TITLE: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  info: "Info",
  example: "Example",
  quote: "Quote",
};

const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
  visit(tree, "containerDirective", (node: any) => {
    const type = node.name as string;
    if (!ADMONITION_TYPES.has(type)) return;

    const attributes = node.attributes ?? {};
    const collapsible = "collapsible" in attributes;
    const open = "open" in attributes;
    const title = attributes.title ?? DEFAULT_TITLE[type];

    node.data = {
      hName: collapsible ? "details" : "div",
      hProperties: {
        className: ["mg-admonition", `mg-admonition--${type}`],
        ...(collapsible && open ? { open: true } : {}),
      },
    };

    node.children.unshift({
      type: "paragraph",
      data: {
        hName: collapsible ? "summary" : "p",
        hProperties: { className: ["mg-admonition__title"] },
      },
      children: [{ type: "text", value: title }],
    });
  });
};

export default remarkAdmonitions;
