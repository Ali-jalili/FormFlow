/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("../services/formsService", () => ({
  submitResponse: vi.fn().mockResolvedValue("resp-1"),
}));

import { submitResponse } from "../services/formsService";
import usePublicFormSubmit from "./usePublicFormSubmit";
import { FORM_FIELD_TYPES } from "../utils/form.constants";

const requiredShort = {
  id: "f1",
  type: FORM_FIELD_TYPES.SHORT_TEXT,
  label: "Name",
  required: true,
};

const choiceField = {
  id: "f2",
  type: FORM_FIELD_TYPES.MULTIPLE_CHOICE,
  label: "Color",
  required: false,
  options: ["red", "blue"],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePublicFormSubmit validation", () => {
  it("flags a required field that is left empty", async () => {
    const { result } = renderHook(() =>
      usePublicFormSubmit("pub-1", [requiredShort]),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.fieldErrors.f1).toMatch(/required/i);
    expect(submitResponse).not.toHaveBeenCalled();
  });

  it("flags a required field containing only whitespace", async () => {
    const { result } = renderHook(() =>
      usePublicFormSubmit("pub-1", [requiredShort]),
    );

    act(() => {
      result.current.updateAnswer("f1", "   ");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.fieldErrors.f1).toMatch(/required/i);
    expect(submitResponse).not.toHaveBeenCalled();
  });

  it("flags a multiple-choice answer that is not one of the options", async () => {
    const { result } = renderHook(() =>
      usePublicFormSubmit("pub-1", [choiceField]),
    );

    act(() => {
      result.current.updateAnswer("f2", "green");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.fieldErrors.f2).toMatch(/invalid option/i);
    expect(submitResponse).not.toHaveBeenCalled();
  });

  it("accepts a valid choice and submits to the RPC", async () => {
    const { result } = renderHook(() =>
      usePublicFormSubmit("pub-1", [requiredShort, choiceField]),
    );

    act(() => {
      result.current.updateAnswer("f1", "Ali");
      result.current.updateAnswer("f2", "blue");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(submitResponse).toHaveBeenCalledWith("pub-1", {
      f1: "Ali",
      f2: "blue",
    });
    await waitFor(() => expect(result.current.isSubmitted).toBe(true));
  });

  it("clears a field's error as soon as the user answers it", async () => {
    const { result } = renderHook(() =>
      usePublicFormSubmit("pub-1", [requiredShort]),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.fieldErrors.f1).toBeDefined();

    act(() => {
      result.current.updateAnswer("f1", "answered");
    });
    expect(result.current.fieldErrors.f1).toBeUndefined();
  });
});
