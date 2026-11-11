/** @format */

import { describe, it, expect } from "vitest";

import {
  isDraftDifferentFromServer,
  DEFAULT_FORM_VALUES,
} from "./formBuilder.utils";

describe("isDraftDifferentFromServer", () => {
  it("returns false for a null draft", () => {
    expect(isDraftDifferentFromServer(null, { ...DEFAULT_FORM_VALUES })).toBe(
      false,
    );
    expect(
      isDraftDifferentFromServer(undefined, { ...DEFAULT_FORM_VALUES }),
    ).toBe(false);
  });

  it("returns false when draft matches the server", () => {
    const base = {
      title: "My Form",
      fields: [
        {
          id: "f1",
          type: "short_text",
          label: "Name",
          required: true,
          options: [],
        },
      ],
    };
    expect(isDraftDifferentFromServer(base, base)).toBe(false);
  });

  it("ignores irrelevant whitespace in the title", () => {
    const draft = { title: "  My Form  ", fields: [] };
    const server = { title: "My Form", fields: [] };
    expect(isDraftDifferentFromServer(draft, server)).toBe(false);
  });

  it("returns true when the title differs", () => {
    const draft = { title: "Renamed", fields: [] };
    const server = { title: "Original", fields: [] };
    expect(isDraftDifferentFromServer(draft, server)).toBe(true);
  });

  it("returns true when a field's label differs", () => {
    const server = {
      title: "F",
      fields: [{ id: "f1", type: "short_text", label: "A", required: false }],
    };
    const draft = {
      title: "F",
      fields: [{ id: "f1", type: "short_text", label: "B", required: false }],
    };
    expect(isDraftDifferentFromServer(draft, server)).toBe(true);
  });

  it("returns true when fields are added", () => {
    const server = { title: "F", fields: [] };
    const draft = {
      title: "F",
      fields: [{ id: "f1", type: "long_text", label: "Bio" }],
    };
    expect(isDraftDifferentFromServer(draft, server)).toBe(true);
  });

  it("coerces required to a boolean so false/undefined are equal", () => {
    const draft = {
      title: "F",
      fields: [{ id: "f1", type: "short_text", label: "A", required: false }],
    };
    const server = {
      title: "F",
      fields: [{ id: "f1", type: "short_text", label: "A", required: null }],
    };
    expect(isDraftDifferentFromServer(draft, server)).toBe(false);
  });
});
