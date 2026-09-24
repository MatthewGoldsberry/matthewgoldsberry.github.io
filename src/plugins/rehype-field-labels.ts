/**
 * Marks a leading bold run in a paragraph or list item as a field label —
 * "Role", "What this shows:", "The Problem:" — so `.mg-field-label` in
 * global.css can style it as a run-in tag instead of plain inline bold.
 *
 * This has to run on the hast tree (after markdown → HTML), not as a CSS
 * selector, because the one thing that actually distinguishes a label
 * ("**Label** — the rest of the sentence") from a fully-bolded sentence
 * ("**The whole sentence.**", used a few places as a standalone lede or
 * mini-heading) is whether the `<strong>` is followed by more text — and
 * CSS's structural pseudo-classes (`:only-child`, `:last-child`, …) only ever
 * count sibling *elements*, never text nodes, so a bold run that is the only
 * *element* in its paragraph matches `:only-child` whether or not it has
 * plain text around it. Walking the real children here sees the text node
 * CSS can't.
 */
import { visit } from "unist-util-visit";
import type { Root, Element, ElementContent, Text } from "hast";
import type { Plugin } from "unified";

const LABEL_PARENTS = new Set(["p", "li"]);

function isBlankText(node: ElementContent): node is Text {
  return node.type === "text" && node.value.trim() === "";
}

function hasTrailingContent(children: ElementContent[]): boolean {
  return children.slice(1).some((node) => !isBlankText(node));
}

const rehypeFieldLabels: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node: Element) => {
    if (!LABEL_PARENTS.has(node.tagName)) return;

    const first = node.children[0];
    if (!first || first.type !== "element" || first.tagName !== "strong") return;
    if (!hasTrailingContent(node.children)) return;

    const props = first.properties ?? (first.properties = {});
    const existing = Array.isArray(props.className) ? props.className : [];
    props.className = [...existing, "mg-field-label"];
  });
};

export default rehypeFieldLabels;
