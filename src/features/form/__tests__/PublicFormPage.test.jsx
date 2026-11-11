/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock the data hook + RPC so the page runs without a backend.
vi.mock("../hooks/usePublicForm", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../services/responsesService", () => ({
  submitResponse: vi.fn().mockResolvedValue("resp-1"),
}));

import usePublicForm from "../hooks/usePublicForm";
import { submitResponse } from "../services/responsesService";
import PublicFormPage from "../../../pages/PublicFormPage";

const publishedForm = {
  form: { id: "f1", title: "Test Form", is_published: true },
  fields: [
    {
      id: "q1",
      type: "short_text",
      label: "Your name",
      required: true,
    },
  ],
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/form/pub-1"]}>
      <Routes>
        <Route path="/form/:publicId" element={<PublicFormPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  usePublicForm.mockReturnValue({
    data: publishedForm,
    isLoading: false,
    error: null,
  });
});

describe("PublicFormPage", () => {
  it("renders the form title and fields", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Test Form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  });

  it("blocks submission when a required field is empty", async () => {
    renderPage();

    await userEvent.click(
      screen.getByRole("button", { name: /submit response/i }),
    );

    await waitFor(() => expect(submitResponse).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText("Your name is required")).toBeInTheDocument(),
    );
  });

  it("submits successfully after filling the field (RPC mocked)", async () => {
    renderPage();

    await userEvent.type(screen.getByLabelText(/your name/i), "Ali");
    await userEvent.click(
      screen.getByRole("button", { name: /submit response/i }),
    );

    await waitFor(() =>
      expect(submitResponse).toHaveBeenCalledWith("pub-1", { q1: "Ali" }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /response submitted/i }),
      ).toBeInTheDocument(),
    );
  });

  it("shows the unavailable screen when the form is unpublished", () => {
    usePublicForm.mockReturnValue({
      data: null,
      isLoading: false,
      error: { code: "PGRST116", message: "This form is not available." },
    });

    renderPage();

    expect(
      screen.getByRole("heading", { name: /no longer available/i }),
    ).toBeInTheDocument();
  });
});
