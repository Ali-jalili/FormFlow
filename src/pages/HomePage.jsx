/** @format */

import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Layout,
  Share2,
  Sparkles,
} from "lucide-react";
import Reveal from "../features/home/components/Reveal";
import HomeProductPreview from "../features/home/components/HomeProductPreview";
import {
  FeaturesSection,
  SecuritySection,
  WorkflowSection,
  FinalCtaSection,
} from "../features/home/components/HomeSections";

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
          <HomeProductPreview />
        </div>
      </section>

      {/* =========================================================
          FEATURES SECTION
      ========================================================= */}
      <FeaturesSection features={features} />

      {/* =========================================================
          SECURITY / PRIVACY (differentiator, all actually shipped)
      ========================================================= */}
      <SecuritySection />

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <WorkflowSection steps={steps} />

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <FinalCtaSection />
    </div>
  );
}

export default HomePage;
