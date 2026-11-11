import {
  BarChart3,
  CheckCircle2,
  GripVertical,
  Layout,
  Link2,
  MessageSquareText,
  Plus,
  Send,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";

function HomeProductPreview() {
  return (
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
  );
}

export default HomeProductPreview;
