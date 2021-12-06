import { getChild, getDataOrPanic } from "../helpers";
import path from "path";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
          query {
            allSitePage{
              nodes {
                id
                childMarkdownRemark {
                  frontmatter {
                    title
                    description
                    draft
                    noindex
                    sidebar_order
                    redirect_from
                    keywords
                  }
                  fields {
                    slug
                    legacy
                  }
                  excerpt(pruneLength: 5000)
                }
                childMdx {
                  frontmatter {
                    title
                    description
                    draft
                    noindex
                    sidebar_order
                    redirect_from
                    keywords
                  }
                  fields {
                    slug
                    legacy
                  }
                  excerpt(pruneLength: 5000)
                }
              }
            }
          }
        `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/algolia.tsx`);
  data.allFile.nodes.map((node: any) => {
    const child = getChild(node);
    if (child && child.fields) {
      actions.createPage({
        path: path.join("algolia", child.fields.slug),
        component,
        context: {
          excerpt: child.excerpt,
          ...child.frontmatter,
          id: node.id,
          legacy: child.fields.legacy,
        },
      });
    }
  });
};
