import { ArrowRight, Link2, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

function FeaturesSection({ features }) {
  return (
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
  );
}

function SecuritySection() {
  return (
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
                opening your link only ever see your form â€” never who owns it or
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
                  body: "Submissions pass a Postgres check â€” required fields, types and size.",
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
  );
}

function WorkflowSection({ steps }) {
  return (
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
  );
}

function FinalCtaSection() {
  return (
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
  );
}

export { FeaturesSection, SecuritySection, WorkflowSection, FinalCtaSection };
