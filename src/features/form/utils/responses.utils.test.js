/** @format */

import { describe, expect, it } from "vitest";

import { filterResponses } from "./responses.utils";

const fields = [
  { id: "name", label: "Full name" },
  { id: "feedback", label: "Feedback" },
];

const responses = [
  { id: "1", data: { name: "Sam", feedback: "Great service" } },
  { id: "2", data: { name: "Alex", feedback: "Needs improvement" } },
  { id: "3", data: { legacy_question: "Fast delivery" } },
];

describe("filterResponses", () => {
  it("returns all responses when the search is empty", () => {
    expect(filterResponses(responses, fields, "  ")).toEqual(responses);
  });

  it("matches answers case-insensitively", () => {
    expect(filterResponses(responses, fields, "GREAT")).toEqual([
      responses[0],
    ]);
  });

  it("matches current question labels and answers to removed questions", () => {
    expect(filterResponses(responses, fields, "feedback")).toEqual([
      responses[0],
      responses[1],
    ]);
    expect(filterResponses(responses, fields, "legacy_question")).toEqual([
      responses[2],
    ]);
  });

  it("handles absent response and field data", () => {
    expect(filterResponses(undefined, undefined, "anything")).toEqual([]);
  });
});
