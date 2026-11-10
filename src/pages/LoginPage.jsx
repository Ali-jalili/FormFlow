/** @format */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

import useAuth from "../features/Auth/useAuth";

function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // When arriving via a ProtectedRoute redirect, return the user to the
  // page they originally tried to reach instead of the dashboard.
  const redirectTo = location.state?.from || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData) {
    try {
      await handleLogin(formData.email, formData.password);

      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to log in. Please try again.");
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 px-4 py-12 sm:py-16">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl"
      />

      <section className="relative w-full max-w-md animate-[fadeIn_.4s_ease-out]">
        <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
              <LogIn aria-hidden="true" className="h-6 w-6 text-indigo-600" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Log in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                  {...register("email", {
                    required: "Please enter your email.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      : "border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-rose-600 animate-[fadeIn_.2s_ease-out]"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Please enter your password.",
                  })}
                  className={`w-full rounded-xl border bg-white pl-10 pr-11 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      : "border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff
                      aria-hidden="true"
                      className="h-4 w-4 text-indigo-600 transition-transform"
                    />
                  ) : (
                    <Eye
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform"
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-rose-600 animate-[fadeIn_.2s_ease-out]"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
