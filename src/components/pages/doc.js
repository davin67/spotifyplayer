import React from "react";
import { graphql } from "gatsby";

import BasePage from "../basePage";
import Content from "../content";
import SmartLink from "../smartLink";

const getChild = node => {
  if (!node) return;
  return node.childMarkdownRemark || node.childMdx;
};

const NextPrevBlock = ({ prevPage, nextPage }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Next Steps</h2>
      <div style={{ display: "flex", width: "100%", flex: 1 }}>
        {prevPage && (
          <div>
            <SmartLink to={prevPage.fields.slug} className="btn btn-secondary">
              {prevPage.frontmatter.title}
            </SmartLink>
          </div>
        )}
        {nextPage && (
          <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <SmartLink to={nextPage.fields.slug} className="btn btn-secondary">
              {nextPage.frontmatter.title}
            </SmartLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default props => {
  const child = getChild(props.data.file);
  return (
    <BasePage {...props}>
      <Content file={props.data.file} />
      {(child.fields.prevPage || child.fields.nextPage) && (
        <NextPrevBlock
          prevPage={getChild(child.fields.prevPage)}
          nextPage={getChild(child.fields.nextPage)}
        />
      )}
    </BasePage>
  );
};

export const pageQuery = graphql`
  query DocQuery($id: String) {
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
        fields {
          nextPage {
            childMarkdownRemark {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
            childMdx {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
          prevPage {
            childMarkdownRemark {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
            childMdx {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
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
        fields {
          nextPage {
            childMarkdownRemark {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
            childMdx {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
          prevPage {
            childMarkdownRemark {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
            childMdx {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    }
  }
`;
