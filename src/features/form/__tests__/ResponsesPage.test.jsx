/** @format */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../hooks/useResponses", () => ({
  RESPONSE_PAGE_SIZE: 20,
  default: vi.fn(),
}));
vi.mock("../hooks/useFormFields", () => ({ default: vi.fn() }));
vi.mock("../hooks/useForms", () => ({ default: vi.fn() }));
vi.mock("../services/formsService", () => ({
  getAllResponses: vi.fn(),
}));

import useResponses from "../hooks/useResponses";
import useFormFields from "../hooks/useFormFields";
import useForms from "../hooks/useForms";
import ResponsesPage from "../../../pages/ResponsesPage";

const responses = Array.from({ length: 21 }, (_, index) => ({
  id: `response-${index + 1}`,
  form_id: "form-1",
  data: { "question-1": index === 0 ? "Ali" : `Answer ${index + 1}` },
  created_at: `2026-01-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
}));

function renderResponsesPage() {
  return render(
    <MemoryRouter initialEntries={["/responses/form-1"]}>
      <Routes>
        <Route path="/responses/:formId" element={<ResponsesPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useFormFields.mockReturnValue({
    data: [{ id: "question-1", label: "Name" }],
  });
  useForms.mockReturnValue({
    data: [{ id: "form-1", title: "Customer feedback" }],
  });
  useResponses.mockImplementation((formId, page = 0, search = "") => {
    const matching = search
      ? responses.filter((response) =>
        response.data["question-1"]
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      : responses;
    return {
      data: matching.slice(page * 20, page * 20 + 20),
      count: matching.length,
      totalCount: responses.length,
      isLoading: false,
      error: null,
    };
  });
});

describe("ResponsesPage", () => {
  it("requests the next server page and searches across the full response set", async () => {
    const user = userEvent.setup();
    renderResponsesPage();

    expect(screen.getByText("Submission #1")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(useResponses).toHaveBeenLastCalledWith("form-1", 1, "");
    expect(screen.getByText("Submission #21")).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", {
        name: /search responses by answer/i,
      }),
      "Ali",
    );

    expect(useResponses).toHaveBeenLastCalledWith("form-1", 0, "Ali");
    expect(
      screen.getByText((_, element) => element?.getAttribute("aria-live") === "polite"),
    ).toHaveTextContent("Showing 1 of 21 responses");
    expect(screen.getByText("Ali")).toBeInTheDocument();
  });
});
