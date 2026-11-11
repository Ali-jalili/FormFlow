function AuthLayout({ children }) {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 px-4 py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl"
      />
      <section className="relative w-full max-w-md animate-[fadeIn_.4s_ease-out]">
        {children}
      </section>
    </main>
  );
}

export default AuthLayout;
