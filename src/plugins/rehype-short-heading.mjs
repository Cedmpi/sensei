import { visit } from "unist-util-visit";

const SHORT_RE = /\s*\[short:\s*(.+?)\]\s*$/;

export default function rehypeShortHeading() {
  return (tree) => {
    visit(tree, { type: "element", tagName: "h3" }, (node) => {
      const lastChild = node.children.at(-1);
      if (lastChild?.type !== "text") return;

      const match = SHORT_RE.exec(lastChild.value);
      if (!match) return;

      (node.properties ??= {}).dataShort = match[1];
      lastChild.value = lastChild.value.replace(SHORT_RE, "");
    });
  };
}
