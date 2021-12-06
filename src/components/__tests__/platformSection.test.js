import React from "react";
import renderer from "react-test-renderer";

import PlatformSection from "../platformSection";
import usePlatform, { getFallbackPlatformKeys } from "../hooks/usePlatform";

jest.mock("../hooks/usePlatform");

describe("PlatformSection", () => {
  it("hides content without supported platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => []);

    usePlatform.mockReturnValue([
      {
        key: "ruby",
        fallbackPlatform: null,
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["python"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe(null);
  });

  it("shows content with supported platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => []);

    usePlatform.mockReturnValue([
      {
        key: "python",
        fallbackPlatform: null,
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["python"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("shows content with supported parent platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => ["ruby"]);

    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
        fallbackPlatform: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection supported={["ruby"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("hides content with notSupported platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => []);

    usePlatform.mockReturnValue([
      {
        key: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe(null);
  });

  it("hides content with notSupported parent platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => ["ruby"]);

    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
        fallbackPlatform: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe(null);
  });

  it("shows content without notSupported platform", () => {
    getFallbackPlatformKeys.mockImplementation(() => []);
    usePlatform.mockReturnValue([
      {
        key: "python",
        fallbackPlatform: null,
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(<PlatformSection notSupported={["ruby"]}>Test</PlatformSection>)
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("shows content with supported child platform, notSupported parent", () => {
    getFallbackPlatformKeys.mockImplementation(() => ["ruby"]);
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
        fallbackPlatform: "ruby",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(
        <PlatformSection supported={["ruby.rails"]} notSupported={["ruby"]}>
          Test
        </PlatformSection>
      )
      .toJSON();

    expect(tree).toBe("Test");
  });

  it("hides content with notSupported fallbackPlatform", () => {
    getFallbackPlatformKeys.mockImplementation(() => ["ruby", "javascript"]);
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
        fallbackPlatform: "javascript",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(
        <PlatformSection notSupported={["javascript"]}>Test</PlatformSection>
      )
      .toJSON();

    expect(tree).toBe(null);
  });

  it("shows content with supported fallbackPlatform", () => {
    getFallbackPlatformKeys.mockImplementation(() => ["ruby", "javascript"]);
    usePlatform.mockReturnValue([
      {
        key: "ruby.rails",
        fallbackPlatform: "javascript",
      },
      jest.fn(),
      false,
    ]);
    const tree = renderer
      .create(
        <PlatformSection supported={["javascript"]}>Test</PlatformSection>
      )
      .toJSON();

    expect(tree).toBe("Test");
  });
});
