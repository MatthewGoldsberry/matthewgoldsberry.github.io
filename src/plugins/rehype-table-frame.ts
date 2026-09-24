/**
 * Wraps every Markdown table in a `.mg-table` frame, styled in content.css.
 *
 * The frame exists because a bare <table> can't do two things a table in a
 * writeup needs. Rounded corners: Preflight sets `border-collapse: collapse`,
 * and a collapsed table ignores `border-radius`, so the border has to live on
 * something that isn't the table. And sideways scrolling: a wide table on a
 * phone should scroll inside its own box rather than push the whole page
 * wider, which needs an `overflow-x` container around it.
 */
import { visit, SKIP } from "unist-util-visit";
import type { Root, Element } from "hast";
import type { Plugin } from "unified";

const rehypeTableFrame: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node: Element, index, parent) => {
    if (node.tagName !== "table" || !parent || index === undefined) return;

    parent.children[index] = {
      type: "element",
      tagName: "div",
      properties: { className: ["mg-table"] },
      children: [node],
    };
    // The <table> is now one level down; don't walk into it again.
    return SKIP;
  });
};

export default rehypeTableFrame;
