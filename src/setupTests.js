/** @format */

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// react-hot-toast: keep toasts from mutating the DOM during tests.
// The hook imports the default `toast` object, so provide both a default
// and a named export.
const toastStub = { success: vi.fn(), error: vi.fn(), loading: vi.fn() };
vi.mock("react-hot-toast", () => ({
  default: toastStub,
  toast: toastStub,
  Toaster: () => null,
}));

// navigator.clipboard + URL.createObjectURL are absent in jsdom; provide stubs.
if (!navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn() },
    configurable: true,
  });
}

if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => "blob:mock");
  URL.revokeObjectURL = vi.fn();
}
