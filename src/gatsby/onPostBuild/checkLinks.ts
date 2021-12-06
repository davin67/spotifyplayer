import jsdom from "jsdom";

const MarkdownRemarkQuery = `
query($id:S tring) {
  markdownRemark(id: { eq: $id }) {
    html
  }
}
`;

const MdxQuery = `
query($id: String) {
  mdx(id: { eq: $id }) {
    html
  }
}
`;

const FileQuery = `
query($id: String) {
  file(id: { eq: $id }) {
    childMarkdownRemark {
      html
    }
    childMdx {
      html
    }
  }
}
`;

const getHtmlForNode = async (graphql, node): Promise<string | null> => {
  let query: string;
  if (node.internal.type === "MarkdownRemark") {
    query = MarkdownRemarkQuery;
  } else if (node.internal.type === "Mdx") {
    query = MdxQuery;
  } else if (node.internal.type === "File") {
    query = FileQuery;
  } else {
    return null;
  }
  const result = await graphql(query, { id: node.id });
  const data = result.data;
  if (node.internal.type === "File") {
    return (data.file.childMarkdownRemark || data.file.childMdx).html;
  }
  return data[Object.keys(data)[0]].html;
};

const findLinks = (html: string): string[] => {
  const dom = new jsdom.JSDOM(html);
  // force all urls to be absolute
  const results = [];
  dom.window.document.querySelectorAll("a").forEach(n => results.push(n.href));
  return results;
};

export default async ({ graphql, reporter, getNode }) => {
  reporter.info("Checking for broken links");
  const { data } = await graphql(
    `
      query CheckLinks {
        allSitePage {
          edges {
            node {
              path
              context {
                id
              }
            }
          }
        }
      }
    `
  );

  let errors = 0;
  const knownUrls = new Set(data.allSitePage.edges.map(n => n.node.path));
  await Promise.all(
    data.allSitePage.edges.map(async ({ node }) => {
      if (!node.context || !node.context.id) return;
      const html = await getHtmlForNode(graphql, getNode(node.context.id));
      if (!html) return;
      findLinks(html).forEach(link => {
        // we dont check inline anchors yet
        link = link.split("#", 1)[0].split("?", 1)[0];
        // this only happens when its a same-page anchor
        if (link === "about:blank") {
          return;
        } else if (link.indexOf("mailto:") === 0) {
          return;
        } else if (link.indexOf("/static/") === 0) {
          // we dont yet check static assets
          return;
        } else if (link.indexOf("https://docs.sentry.io") === 0) {
          reporter.error(
            `Absolute link found (relative desired) at ${node.path}: ${link}`
          );
          errors += 1;
        } else if (link.indexOf("https://") === 0) {
          return;
        } else if (!knownUrls.has(link)) {
          reporter.error(`Broken link found at ${node.path}: ${link}`);
          errors += 1;
        }
      });
    })
  );
  if (errors > 0) {
    throw new Error(`${errors} broken links found`);
  }
};
