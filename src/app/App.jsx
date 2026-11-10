/** @format */
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, useLocation, matchPath } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AppRoutes from "./router/router";
import { AuthProvider } from "../features/Auth/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
    },
  },
});

/**
 * Public form routes get a clean, minimal layout (no app chrome),
 * so anonymous respondents don't see the dashboard Header/Footer.
 */
function AppLayout() {
  const { pathname } = useLocation();
  const isPublicForm = !!matchPath("/form/:publicId", pathname);
  const isFormBuilder = !!matchPath("/builder/:formId", pathname);

  return (
    <>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
      <div
        className={
          isFormBuilder
            ? "flex h-screen flex-col overflow-hidden"
            : "flex min-h-screen flex-col"
        }
      >
        {!isPublicForm && !isFormBuilder && <Header />}
        <main className={isFormBuilder ? "min-h-0 flex-1" : "flex-1"}>
          <AppRoutes />
        </main>
        {!isPublicForm && !isFormBuilder && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
