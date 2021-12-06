import React from "react";
import { Highlight, Snippet } from "react-instantsearch-dom";
import { Link } from "gatsby";

export const PageHit = (clickHandler) => ({ hit }) => {
  return (
    <Link key={hit.objectID} to={hit.fields.slug} onClick={clickHandler}>
      <h6 className="mb-1">
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h6>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
      {hit.categories && (
        <div className="ais-Context">
          <div className="ais-Context-left">{hit.categories.join(" • ")}</div>
        </div>
      )}
    </Link>
  );
};

export const LegacyPageHit = (clickHandler) => ({ hit }) => {
  return (
    <Link key={hit.objectID} to={hit.url} onClick={clickHandler}>
      <h6>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h6>
      <Snippet attribute="content" hit={hit} tagName="mark" />
      {hit.categories && (
        <div className="ais-Context">
          <div className="ais-Context-left">{hit.categories.join(" • ")}</div>
        </div>
      )}
    </Link>
  );
};
