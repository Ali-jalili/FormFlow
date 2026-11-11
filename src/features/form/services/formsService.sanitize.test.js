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
  saveFormDraft,
} from "./formsService";
import {
  getAllResponses,
} from "./responsesService";
import {
  sanitizeAnswers,
  MAX_ANSWER_KEYS,
  MAX_ANSWER_LENGTH,
} from "../utils/responseValidation";
import { supabase } from "../../../lib/supabaseClient";
import { FORM_FIELD_TYPES } from "../utils/form.constants";

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

describe("saveFormDraft", () => {
  it("saves the title and normalized fields through one atomic RPC", async () => {
    const fields = [
      {
        id: "field-1",
        type: FORM_FIELD_TYPES.MULTIPLE_CHOICE,
        label: "Color",
        required: true,
        options: ["Red", "", "Blue "],
        order: 4,
      },
    ];
    supabase.rpc.mockResolvedValue({ data: [], error: null });

    await saveFormDraft("form-1", "Survey", fields);

    expect(supabase.rpc).toHaveBeenCalledWith("save_form_draft", {
      p_form_id: "form-1",
      p_title: "Survey",
      p_fields: [
        {
          id: "field-1",
          type: FORM_FIELD_TYPES.MULTIPLE_CHOICE,
          label: "Color",
          required: true,
          options: ["Red", "Blue "],
          order: 1,
        },
      ],
    });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("surfaces an atomic save error", async () => {
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "Field insert failed" },
    });

    await expect(saveFormDraft("form-1", "Survey", [])).rejects.toThrow(
      "Field insert failed",
    );
  });
});

describe("getAllResponses", () => {
  it("fetches every response in bounded pages", async () => {
    const firstPage = Array.from({ length: 1000 }, (_, index) => ({
      id: `response-${index}`,
    }));
    const secondPage = [{ id: "response-1000" }];
    const pages = [
      { data: firstPage, error: null },
      { data: secondPage, error: null },
    ];
    const queries = [];

    supabase.from.mockImplementation(() => {
      const result = pages.shift();
      const query = {
        select: vi.fn(() => query),
        eq: vi.fn(() => query),
        order: vi.fn(() => query),
        range: vi.fn(() => query),
        then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
      };
      queries.push(query);
      return query;
    });

    const responses = await getAllResponses("form-1");

    expect(responses).toHaveLength(1001);
    expect(supabase.from).toHaveBeenCalledTimes(2);
    expect(supabase.from).toHaveBeenCalledWith("responses");
    expect(queries[0].range).toHaveBeenCalledWith(0, 999);
    expect(queries[1].range).toHaveBeenCalledWith(1000, 1999);
  });
});
