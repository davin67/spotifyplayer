import React from "react";
import { graphql } from "gatsby";
import CodeContext, { useCodeContextState } from "../components/codeContext";
import Content from "~src/components/content";
import usePlatform from "../components/hooks/usePlatform";

// cameronmcefee: I set out with the simple aim of getting the static, compiled html result from mdx so we can
// feed it into algolia. After many different attempts at doing this, I'm convinced we are doing gatsby wrong
// and have thus made this impossible for ourselves to do this without fundamentally changing how our pages are created.
// Among the things I've tried, two are the most sensible:
//
// - Query mdx `html` in onPostBuild — this fails because MDXProvider lacks components in globalScope. This can be fixed
//   by moving MDXProvider to wrapRootElement (https://github.com/gatsbyjs/gatsby/issues/20543#issuecomment-610748660)
//   however, our components that depend on `location` require LocationProvider which is only available inside the
//   page context, which is a child of wrapRootElement in wrapPageElement. When MDXProvider is moved there, the
//   global scope warnings happen again.
// - Create a special algolia page template, then read it back in via `fs` - This would theoretically work and is the
//   current state of this branch, however the platform pages don't appear to be part of an allFile query. While I could
//   probably fix this, at this point there are so many layers of redundant or recursive things in this logic that I
//   can't bring myself to further complicate it

export default (props: any) => {
  const [platform] = usePlatform();
  console.log(platform);

  return (
    <CodeContext.Provider value={useCodeContextState()}>
      <div
        className="algolia-data"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ title: "bar" }) }}
      ></div>
      <div className="algolia-searchable">
        <Content file={props.data.file} />
      </div>
    </CodeContext.Provider>
  );
};

export const pageQuery = graphql`
  query AlgoliaQuery($id: String) {
    file(id: { eq: $id }) {
      id
      relativePath
      sourceInstanceName
      childMarkdownRemark {
        html
        tableOfContents
        internal {
          type
        }
        frontmatter {
          title
          noindex
        }
      }
      childMdx {
        body
        tableOfContents
        internal {
          type
        }
        frontmatter {
          title
          noindex
        }
      }
    }
  }
`;
