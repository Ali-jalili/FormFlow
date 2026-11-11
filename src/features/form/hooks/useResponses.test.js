/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: { rpc: vi.fn() },
}));

import { supabase } from "../../../lib/supabaseClient";
import useResponses from "./useResponses";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useResponses", () => {
  it("requests a server-paged response set and search counts", async () => {
    const pageData = {
      responses: [{ id: "response-1", data: { question: "Ali" } }],
      count: 6,
      totalCount: 48,
    };
    supabase.rpc.mockReturnValue({
      abortSignal: vi.fn().mockResolvedValue({ data: pageData, error: null }),
    });

    const { result } = renderHook(
      () => useResponses("form-1", 2, "  Ali  "),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toEqual(pageData.responses));

    expect(supabase.rpc).toHaveBeenCalledWith("get_form_responses_page", {
      p_form_id: "form-1",
      p_page: 2,
      p_page_size: 20,
      p_search: "Ali",
    });
    expect(result.current.count).toBe(6);
    expect(result.current.totalCount).toBe(48);
  });

  it("surfaces database errors instead of showing an empty success state", async () => {
    supabase.rpc.mockReturnValue({
      abortSignal: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Permission denied" },
      }),
    });

    const { result } = renderHook(() => useResponses("form-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.error?.message).toBe("Permission denied"),
    );
  });
});
