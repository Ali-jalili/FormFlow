/** @format */

import { describe, expect, it } from "vitest";

import { buildCsv, escapeCsvCell } from "./csv.utils";

describe("escapeCsvCell", () => {
  it.each(["=1+1", "+SUM(A1:A2)", "-1+2", "@SUM(A1)", " \t=1+1"])(
    "neutralizes formula-like cell %j",
    (value) => {
      expect(escapeCsvCell(value)).toBe(`'${value}`);
    },
  );

  it("quotes delimiters and doubles embedded quotes", () => {
    expect(escapeCsvCell('hello, "world"')).toBe('"hello, ""world"""');
    expect(escapeCsvCell("line 1\nline 2")).toBe('"line 1\nline 2"');
  });

  it("builds CRLF-separated rows and escapes every cell", () => {
    expect(
      buildCsv([
        ["Name", "Answer"],
        ["Ali", "=1+1"],
      ]),
    ).toBe("Name,Answer\r\nAli,'=1+1");
  });
});
