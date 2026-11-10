/** @format */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  GripVertical,
  Layout,
  Link2,
  Lock,
  MessageSquareText,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

function Reveal({ children, className = "", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`home-reveal ${
        isVisible ? "home-reveal--visible" : "home-reveal--hidden"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function HomePage() {
  const features = [
    {
      icon: Layout,
      title: "Drag & Drop Builder",
      description:
        "Compose forms with a visual editor — reorder fields, set them as required, and preview everything live as you go.",
      iconClass:
        "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    },
    {
      icon: Share2,
      title: "Stable Public Links",
      description:
        "Publish in one click and share a link that stays the same — even when you republish or unpublish and republish again.",
      iconClass:
        "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      icon: FileText,
      title: "Response Dashboard",
      description:
        "Review every submission in a clean, ordered view — including answers to questions you've since removed — and export to CSV in one click.",
      iconClass:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create",
      description:
        "Build your form with flexible fields in a few simple clicks.",
    },
    {
      number: "02",
      title: "Publish",
      description:
        "Publish your form and get a shareable public link instantly.",
    },
    {
      number: "03",
      title: "Collect",
      description:
        "Collect responses and understand what your users are saying.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900 selection:bg-indigo-500 selection:text-white">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pt-32">
        {/* Background Ambient Glow & Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
          <div className="home-orb absolute left-1/2 top-[-100px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/60 to-purple-200/60 blur-3xl" />
          <div className="home-orb home-orb--delayed absolute left-[-100px] top-[300px] h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="home-orb absolute right-[-100px] top-[200px] h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Hero Copy */}
          <Reveal className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-md transition-all hover:scale-105">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-600" />
              <span>Free to try</span>
              <span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span className="text-indigo-500 font-normal">
                No credit card
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Build, share, and{" "}
              <span className="home-gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] bg-clip-text text-transparent">
                collect responses
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Create a form in minutes, keep one dependable link as it evolves,
              and review every submission in one tidy dashboard.
            </p>

            {/* CTA Group */}
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-500/35 active:translate-y-0 sm:w-auto"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white/80 px-7 py-4 text-base font-medium text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50/80 hover:text-gray-900 sm:w-auto"
              >
                See how it works
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </Reveal>

          {/* =====================================================
              PRODUCT PREVIEW
          ===================================================== */}
          <Reveal className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            {/* Floating Card 1: Status */}
            <div className="home-float absolute -bottom-6 left-4 z-20 hidden items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-3.5 shadow-2xl shadow-indigo-900/10 backdrop-blur-md sm:flex lg:-left-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left pr-2">
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Status
                </p>
                <p className="text-xs font-bold text-gray-800">
                  Form published
                </p>
              </div>
            </div>

            {/* Floating Card 2: Shareable Link */}
            <div className="home-float home-float--delayed absolute -right-6 -top-6 z-20 hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-2xl shadow-indigo-900/10 backdrop-blur-md lg:block">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100/80 text-indigo-600">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    Ready to share
                  </p>
                  <p className="text-base font-extrabold text-gray-900">
                    Public form link
                  </p>
                </div>
              </div>
            </div>

            {/* Main Mockup Frame */}
            <div className="relative rounded-2xl border border-gray-200/80 bg-white/50 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:rounded-3xl sm:p-3">
              {/* Browser Header */}
              <div className="flex h-11 items-center gap-2 rounded-t-xl bg-gray-100/80 px-4 sm:h-12">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>

                <div className="ml-4 flex h-7 flex-1 items-center rounded-md border border-gray-200/60 bg-white px-3 max-w-sm">
                  <span className="truncate text-[11px] font-medium text-gray-500">
                    https://app.formflow.com/builder/customer-feedback
                  </span>
                </div>
              </div>

              {/* App Workspace */}
              <div className="overflow-hidden rounded-b-xl border-t border-gray-200/60 bg-gray-50/50 sm:rounded-b-2xl">
                <div className="flex min-h-[420px] sm:min-h-[500px]">
                  {/* Sidebar */}
                  <aside className="hidden w-52 shrink-0 border-r border-gray-200/60 bg-white p-5 md:block">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-extrabold text-gray-900">
                        FormFlow
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Workspace
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                          <Layout className="h-4 w-4" /> My Forms
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50">
                          <MessageSquareText className="h-4 w-4" /> Responses
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50">
                          <BarChart3 className="h-4 w-4" /> Analytics
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Canvas */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {/* Top Toolbar */}
                    <div className="flex items-center justify-between border-b border-gray-200/60 bg-white px-5 py-3.5">
                      <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-bold text-gray-900">
                          Customer Feedback
                        </p>
                        <p className="text-[10px] text-gray-400">
                          4 fields · Auto-saved
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 sm:block">
                          Preview
                        </div>
                        <div className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                          Publish
                        </div>
                      </div>
                    </div>

                    {/* Builder Body */}
                    <div className="flex flex-1 gap-5 p-4 sm:p-6">
                      <div className="min-w-0 flex-1">
                        {/* Interactive Drag Fields */}
                        <div className="group mb-3 rounded-xl border border-indigo-200 bg-white p-4 text-left shadow-sm ring-2 ring-indigo-500/10">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-indigo-400 cursor-grab" />
                              <p className="text-xs font-bold text-gray-800">
                                What is your name?
                              </p>
                            </div>
                            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-600">
                              Short Text
                            </span>
                          </div>
                          <div className="h-9 rounded-lg border border-gray-200 bg-gray-50/50" />
                        </div>

                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-gray-300" />
                              <p className="text-xs font-bold text-gray-800">
                                How satisfied are you?
                              </p>
                            </div>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500">
                              Choice
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {[
                              "Very satisfied",
                              "Satisfied",
                              "Needs Improvement",
                            ].map((opt, i) => (
                              <div
                                key={opt}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`h-3 w-3 rounded-full border ${i === 0 ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}
                                />
                                <span className="text-[10px] font-medium text-gray-600">
                                  {opt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white/60 py-3 text-xs font-semibold text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                          <Plus className="h-4 w-4" /> Add New Field
                        </div>
                      </div>

                      {/* Right Panel: Live Preview Card */}
                      <div className="hidden w-72 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm lg:block text-left">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-800">
                            Live Preview
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                            Live
                          </span>
                        </div>

                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5 space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-700">
                              What is your name?
                            </label>
                            <div className="mt-1 h-7 rounded bg-white border border-gray-200" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-700">
                              How satisfied are you?
                            </label>
                            <div className="mt-1 space-y-1">
                              <div className="h-4 w-24 rounded bg-indigo-100/60" />
                              <div className="h-4 w-20 rounded bg-gray-200/60" />
                            </div>
                          </div>
                          <div className="pt-2 flex justify-end">
                            <div className="rounded bg-indigo-600 px-3 py-1 text-[9px] font-bold text-white flex items-center gap-1">
                              Submit <Send className="h-2 w-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          FEATURES SECTION
      ========================================================= */}
      <section
        id="features"
        className="relative border-t border-gray-100 bg-gray-50/50 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Powerful Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Built for speed and simplicity
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Everything required to collect high-quality data without friction.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={index * 100} className="h-full">
                <div className="group relative h-full rounded-2xl border border-gray-200/80 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${feature.iconClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECURITY / PRIVACY (differentiator, all actually shipped)
      ========================================================= */}
      <section
        id="security"
        className="border-t border-gray-100 bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                Built safe by default
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your data, protected at the database layer
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400">
                Every table in FormFlow is guarded by Row Level Security. People
                opening your link only ever see your form — never who owns it or
                your other responses.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Row Level Security",
                  "Anonymous access",
                  "Validated submissions",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Lock,
                  title: "Isolated by owner",
                  body: "Owners manage only their own forms, fields and responses.",
                },
                {
                  icon: ShieldCheck,
                  title: "Server-validated",
                  body: "Submissions pass a Postgres check — required fields, types and size.",
                },
                {
                  icon: Link2,
                  title: "Links that last",
                  body: "Re-publishing never breaks a link you already shared.",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 100}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-colors hover:border-indigo-400/40 hover:bg-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-sm font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="px-4 py-24 sm:px-6 lg:px-8 bg-white"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Workflow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Three steps to results
            </h2>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-indigo-100 md:block" />

            {steps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 100}
                className="relative z-10 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-indigo-100 bg-white text-xl font-black text-indigo-600 shadow-xl shadow-indigo-100">
                  {step.number}
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center shadow-2xl shadow-indigo-500/30 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_right,#818cf8,transparent_50%)] opacity-50" />

          <Reveal className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Start capturing better responses today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-indigo-100 sm:text-lg">
              Set up your first form in less than 2 minutes. No credit card
              required.
            </p>

            <Link
              to="/signup"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
