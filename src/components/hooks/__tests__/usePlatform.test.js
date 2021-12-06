import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import PageContext from "../../pageContext";
import usePlatform, { getFallbackPlatformKeys } from "../usePlatform";
import useLocalStorage from "../useLocalStorage";

import { useLocation, useNavigate } from "@reach/router";
import { useStaticQuery } from "gatsby";

const PLATFORMS = [
  {
    key: "javascript",
    name: "javascript",
    title: "JavaScript",
    url: "/platforms/javascript/",
    guides: [],
  },
  {
    key: "node",
    name: "node",
    title: "Node.js",
    fallbackPlatform: "javascript",
    url: "/platforms/node/",
    guides: [
      {
        key: "node.koa",
        name: "koa",
        title: "Koa",
        url: "/platforms/node/guides/koa/",
        fallbackPlatform: "node",
      },
    ],
  },
  {
    key: "ruby",
    name: "ruby",
    title: "Ruby",
    url: "/platforms/ruby/",
    guides: [
      {
        key: "ruby.rails",
        name: "rails",
        title: "Rails",
        url: "/platforms/ruby/guides/rails/",
        fallbackPlatform: "ruby",
      },
    ],
  },
];

jest.mock("../useLocalStorage");

describe("getFallbackPlatformKeys", () => {
  it("uses the multiple fallbacks", () => {
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));

    const results = getFallbackPlatformKeys(
      PLATFORMS.find(d => d.key === "node").guides.find(
        d => d.key === "node.koa"
      )
    );
    expect(results.length).toBe(2);
    expect(results[0]).toBe("node");
    expect(results[1]).toBe("javascript");
  });
});

describe("usePlatform", () => {
  beforeEach(() => {
    useLocalStorage.mockReturnValue([null, jest.fn()]);
    useStaticQuery.mockImplementation(() => ({
      allPlatform: {
        nodes: PLATFORMS,
      },
    }));
  });

  it("uses the default of javascript", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );
    useLocation.mockReturnValue({
      pathname: "/",
    });

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("javascript");
  });

  it("identifies platform from route", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("ruby");
  });

  it("sets and navigates to new path", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });

    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("javascript");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/platforms/javascript/");

    expect(result.current[0].key).toBe("javascript");
  });

  it("sets and navigates to doesnt navigate if path unchanged", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{ platform: { name: "ruby" } }}>
        {children}
      </PageContext.Provider>
    );

    useLocation.mockReturnValue({
      pathname: "/platforms/ruby/",
    });

    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(0);

    expect(result.current[0].key).toBe("ruby");
  });

  it("identifies platform from querystring", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );

    useLocation.mockReturnValue({
      pathname: "/",
      search: "?platform=ruby",
    });

    const { result } = renderHook(() => usePlatform(), { wrapper });
    expect(result.current[0].key).toBe("ruby");
  });

  it("sets and navigates to new querystring", () => {
    const wrapper = ({ children }) => (
      <PageContext.Provider value={{}}>{children}</PageContext.Provider>
    );

    useLocation.mockReturnValue({
      pathname: "/",
      search: "?platform=javascript",
    });
    const navigate = jest.fn();

    useNavigate.mockImplementation(() => navigate);

    const { result } = renderHook(() => usePlatform(), { wrapper });

    act(() => {
      result.current[1]("ruby");
    });

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe("/?platform=ruby");

    expect(result.current[0].key).toBe("ruby");
  });
});
