/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import useAuth from "../features/Auth/useAuth";
import AuthLayout from "../components/auth/AuthLayout";

// الگوی استاندارد: حداقل 6 کاراکتر، حداقل یک حرف کوچک، یک حرف بزرگ و یک عدد
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

function SignupPage() {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange", // بررسی آنی حین تایپ
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  // بررسی آنی فرمت استاندارد رمز عبور
  const isPasswordValid = PASSWORD_REGEX.test(passwordValue);

  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const result = await handleSignup(
        values.email,
        values.password,
        values.name,
      );

      if (result?.needsEmailConfirmation) {
        toast.success(
          "Account created! Check your inbox to confirm your email, then log in.",
          { duration: 8000 },
        );
        navigate("/login", { replace: true });
      } else {
        toast.success("Account created! Welcome aboard!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
            <UserPlus aria-hidden="true" className="h-6 w-6 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Start building beautiful forms in minutes.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 space-y-5"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={isLoading}
                {...register("name", {
                  required: "Please enter your name.",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                  },
                })}
                className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              />
            </div>

            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-rose-600"
              >
                {errors.name.message}
              </p>
            )}
          </div>

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
                disabled={isLoading}
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
                className="mt-1.5 text-xs font-medium text-rose-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="h-4 w-4" />
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : "password-hint"
                }
                disabled={isLoading}
                {...register("password", {
                  required: "Please create a password.",
                  pattern: {
                    value: PASSWORD_REGEX,
                    message:
                      "Must contain at least 6 characters, including uppercase, lowercase, and a number.",
                  },
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
                disabled={isLoading}
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

            {/* Password Validation Feedback */}
            {errors.password ? (
              <p
                id="password-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-rose-600 animate-[fadeIn_.2s_ease-out]"
              >
                {errors.password.message}
              </p>
            ) : (
              <div
                id="password-hint"
                className="mt-2 flex items-center gap-1.5 text-xs transition-all duration-200"
              >
                {isPasswordValid ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 animate-[fadeIn_.2s_ease-out]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                )}
                <span
                  className={
                    isPasswordValid
                      ? "font-medium text-emerald-700"
                      : "text-gray-400"
                  }
                >
                  At least 6 characters with uppercase, lowercase, and a number
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default SignupPage;
