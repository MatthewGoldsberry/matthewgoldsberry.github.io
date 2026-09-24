/**
 * Wraps every highlighted code block in a `.mg-code` frame and gives it a
 * copy button — styled in content.css, wired up by the one small script in
 * `ProseLayout.astro`.
 *
 * The button is authored here, at build time, rather than injected by that
 * script, so the markup is static HTML like everything else and the script
 * only has to attach behaviour. It ships `hidden`: copying needs the
 * Clipboard API, so without JavaScript there is nothing for it to do, and a
 * dead button is worse than none. The script un-hides it.
 *
 * Runs after Shiki (Astro always applies its highlighter before user rehype
 * plugins), so the `<pre>` it finds is Shiki's finished output.
 */
import { visit, SKIP } from "unist-util-visit";
import type { Root, Element } from "hast";
import type { Plugin } from "unified";

/* Two stroked glyphs sharing one 24-unit box: a pair of sheets for "copy",
   a tick for "copied". The script swaps which one shows. */
const icon = (className: string, d: string): Element => ({
  type: "element",
  tagName: "svg",
  properties: {
    className: ["mg-code__icon", className],
    viewBox: "0 0 24 24",
    width: 16,
    height: 16,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ariaHidden: "true",
  },
  children: [{ type: "element", tagName: "path", properties: { d }, children: [] }],
});

const copyButton = (): Element => ({
  type: "element",
  tagName: "button",
  properties: {
    type: "button",
    className: ["mg-code__copy"],
    ariaLabel: "Copy code",
    hidden: true,
  },
  children: [
    icon(
      "mg-code__icon--copy",
      "M9 9h10v12H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
    ),
    icon("mg-code__icon--done", "M5 12.5l4.5 4.5L19 7"),
    {
      type: "element",
      tagName: "span",
      properties: { className: ["mg-code__status"], ariaLive: "polite" },
      children: [],
    },
  ],
});

const rehypeCodeFrame: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node: Element, index, parent) => {
    if (node.tagName !== "pre" || !parent || index === undefined) return;

    parent.children[index] = {
      type: "element",
      tagName: "div",
      properties: { className: ["mg-code"] },
      children: [node, copyButton()],
    };
    // The <pre> is now one level down; don't walk into it again.
    return SKIP;
  });
};

export default rehypeCodeFrame;
