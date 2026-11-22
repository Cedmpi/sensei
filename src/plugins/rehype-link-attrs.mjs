import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";

const PageSection = Object.freeze({
  Teleseminar: "teleseminar",
  University: "university",
});

const defaultInclude = new RegExp(
  `(?:^|/)pages/(?:${Object.values(PageSection).join("|")})/`,
);

/**
 * Adds default attributes to Markdown and inline HTML links in matching files.
 */
export default function rehypeLinkAttrs(options = {}) {
  const {
    include = defaultInclude,
    className = ["underline"],
    target = "_blank",
    rel = "noopener noreferrer",
  } = options;

  const parseRawHtml = rehypeRaw();

  return (tree, file) => {
    if (include) {
      const path = String(file?.path ?? "").replace(/\\/g, "/");
      const layout = String(file?.data?.astro?.frontmatter?.layout ?? "");

      include.lastIndex = 0;
      const matchesPath = include.test(path);
      include.lastIndex = 0;
      const matchesLayout = include.test(layout);

      if (!matchesPath && !matchesLayout) return;
    }

    // Astro parses raw HTML after custom rehype plugins run.
    const parsedTree = parseRawHtml(tree, file);

    visit(parsedTree, { type: "element", tagName: "a" }, (node) => {
      const props = (node.properties ??= {});

      if (className && !Object.hasOwn(props, "className")) {
        const classes = [...new Set([className].flat().filter(Boolean))];
        if (classes.length) props.className = classes;
      }

      if (target && !Object.hasOwn(props, "target")) props.target = target;
      if (rel && !Object.hasOwn(props, "rel")) props.rel = rel;
    });

    return parsedTree;
  };
}
