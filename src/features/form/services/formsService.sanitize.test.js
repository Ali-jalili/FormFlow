/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Keep formsService importable in Node (no Supabase env vars in CI).
vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

import {
  sanitizeAnswers,
  MAX_ANSWER_KEYS,
  MAX_ANSWER_LENGTH,
} from "./formsService";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sanitizeAnswers", () => {
  it("trims string answers and keeps non-empty ones", () => {
    expect(sanitizeAnswers({ q1: "  hello  " })).toEqual({ q1: "hello" });
  });

  it("drops whitespace-only answers", () => {
    expect(sanitizeAnswers({ q1: "   ", q2: "keep" })).toEqual({ q2: "keep" });
  });

  it("stringifies non-string values", () => {
    expect(sanitizeAnswers({ q1: 42, q2: true })).toEqual({
      q1: "42",
      q2: "true",
    });
  });

  it("ignores oversized keys (>64 chars)", () => {
    const longKey = "k".repeat(65);
    const result = sanitizeAnswers({ [longKey]: "v", ok: "fine" });
    expect(result).toEqual({ ok: "fine" });
  });

  it("truncates answers longer than MAX_ANSWER_LENGTH", () => {
    const big = "x".repeat(MAX_ANSWER_LENGTH + 500);
    const result = sanitizeAnswers({ q1: big });
    expect(result.q1).toHaveLength(MAX_ANSWER_LENGTH);
  });

  it("throws when there are no answers at all", () => {
    expect(() => sanitizeAnswers({})).toThrow("No answers to submit.");
    expect(() => sanitizeAnswers({ q1: "   " })).toThrow(
      "No answers to submit.",
    );
  });

  it("throws on non-object payloads", () => {
    expect(() => sanitizeAnswers(null)).toThrow(/object/i);
    expect(() => sanitizeAnswers(["a", "b"])).toThrow(/object/i);
  });

  it(`rejects more than ${MAX_ANSWER_KEYS} answers`, () => {
    const payload = {};
    for (let i = 0; i < MAX_ANSWER_KEYS + 1; i++) payload[`f${i}`] = "v";
    expect(() => sanitizeAnswers(payload)).toThrow(/Too many/i);
  });
});
