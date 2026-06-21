import Link from "next/link";

const headingFont = "font-[family-name:var(--font-plus-jakarta)]";

const FEATURE_TAGS = [
  {
    label: "24/7 Available",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "No Coding",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L4 14H11L10 22L20 10H13L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "AI Powered",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9H15M9 12H15M9 15H12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Secure",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L5 7V12C5 16.5 8.5 20 12 21C15.5 20 19 16.5 19 12V7L12 3Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
] as const;

const STATS = [
  { value: "98%", label: "Lead Response Rate" },
  { value: "3x", label: "More Bookings" },
  { value: "24/7", label: "Always Online" },
  { value: "2min", label: "Avg Setup Time" },
] as const;

const AVATARS = [
  { initial: "E", className: "bg-violet-500" },
  { initial: "S", className: "bg-blue-500" },
  { initial: "M", className: "bg-cyan-500" },
  { initial: "A", className: "bg-emerald-500" },
  { initial: "D", className: "bg-orange-500" },
] as const;

function DashboardPreview() {
  const menuItems = [
    { label: "Dashboard", active: false },
    { label: "Conversations", active: false, badge: "3" },
    { label: "Leads", active: false },
    { label: "Appointments", active: false },
    { label: "Analytics", active: true },
    { label: "AI Training", active: false },
    { label: "Settings", active: false },
  ] as const;

  const kpiCards = [
    { label: "Total Revenue", value: "$41,400", change: "+31%" },
    { label: "Total Leads", value: "600", change: "+24%" },
    { label: "Bookings", value: "261", change: "+18%" },
    { label: "AI Accuracy", value: "98.1%", change: "+2.3%" },
    { label: "Calls Saved", value: "1,284", change: "+44%" },
  ] as const;

  const services = [
    { name: "Emergency Plumbing", value: "$6.4k", width: "92%", color: "bg-violet-500" },
    { name: "Drain Cleaning", value: "$3.2k", width: "68%", color: "bg-blue-500" },
    { name: "Pipe Repair", value: "$2.8k", width: "58%", color: "bg-cyan-500" },
    { name: "Water Heater", value: "$2.4k", width: "48%", color: "bg-emerald-500" },
    { name: "Leak Detection", value: "$1.8k", width: "36%", color: "bg-amber-500" },
  ] as const;

  return (
    <div className="relative mx-auto w-full overflow-visible px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[180%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,97,255,0.42) 0%, rgba(0,97,255,0.2) 28%, rgba(0,97,255,0.08) 48%, rgba(0,97,255,0.03) 62%, transparent 78%)",
          filter: "blur(48px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[240%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,97,255,0.22) 0%, rgba(0,97,255,0.1) 35%, rgba(0,97,255,0.04) 55%, transparent 75%)",
          filter: "blur(64px)",
        }}
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-2xl bg-white sm:rounded-[1.25rem]">
        <div className="flex min-h-[360px] sm:min-h-[420px]">
            <aside className="hidden w-[148px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-2.5 py-3 sm:flex lg:w-[168px]">
              <div className="mb-3 flex items-center gap-1.5 px-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[10px] text-white">
                  ✦
                </div>
                <span className="text-[10px] font-bold text-slate-800">NexFlow AI</span>
              </div>

              <div className="mb-3 rounded-xl border border-violet-100 bg-violet-50/80 p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[9px] font-bold text-white">
                    EP
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold text-slate-800">
                      Elite Plumbing Pro
                    </p>
                    <p className="text-[8px] font-medium text-emerald-600">● AI Active</p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-1 flex-col gap-0.5">
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className={`relative flex items-center justify-between rounded-lg px-2 py-1.5 text-[9px] font-medium ${
                      item.active
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-500"
                    }`}
                  >
                    {item.active && (
                      <span className="absolute bottom-1 left-0 top-1 w-0.5 rounded-full bg-violet-500" />
                    )}
                    <span className="pl-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </nav>

              <p className="mt-2 px-1 text-[8px] text-slate-400">← Back to Website</p>
            </aside>

            <div className="min-w-0 flex-1 bg-white p-2.5 sm:p-3">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-7 flex-1 items-center gap-1.5 rounded-lg bg-slate-100 px-2 text-[9px] text-slate-400">
                  <span>⌕</span>
                  <span>Search anything...</span>
                </div>
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-500">
                  🔔
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-violet-500" />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[9px] font-bold text-white">
                  EP
                </div>
              </div>

              <div className="mb-2.5">
                <p className="text-sm font-bold text-slate-900">Analytics</p>
                <p className="text-[9px] text-slate-400">6-month performance overview</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
                {kpiCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-lg border border-slate-100 bg-slate-50/80 p-2"
                  >
                    <p className="text-[8px] text-slate-400">{card.label}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-slate-800">{card.value}</p>
                    <p className="text-[8px] font-medium text-emerald-600">{card.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-700">
                      Revenue &amp; Leads Trend
                    </p>
                    <p className="text-[8px] text-slate-400">January – June 2026</p>
                  </div>
                  <div className="flex gap-2 text-[8px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Revenue
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      Leads
                    </span>
                  </div>
                </div>
                <div className="relative h-20">
                  <svg viewBox="0 0 320 80" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8c5bfd" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 65 L40 58 L80 52 L120 45 L160 38 L200 30 L240 22 L280 14 L320 8 L320 80 L0 80 Z"
                      fill="url(#areaFill)"
                    />
                    <path
                      d="M0 65 L40 58 L80 52 L120 45 L160 38 L200 30 L240 22 L280 14 L320 8"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                  <p className="text-[9px] font-semibold text-slate-700">Lead Sources</p>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="relative h-14 w-14 rounded-full border-[9px] border-violet-500 border-r-blue-500 border-b-cyan-400 border-l-emerald-400" />
                  </div>
                  <div className="mt-2 space-y-0.5 text-[7px] text-slate-500">
                    <p>Web Chat 58%</p>
                    <p>Phone 22% · SMS 13% · Email 7%</p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                  <p className="text-[9px] font-semibold text-slate-700">Top Services</p>
                  <div className="mt-2 space-y-1.5">
                    {services.map((service) => (
                      <div key={service.name}>
                        <div className="flex justify-between text-[7px] text-slate-500">
                          <span className="truncate pr-1">{service.name}</span>
                          <span>{service.value}</span>
                        </div>
                        <div className="mt-0.5 h-1.5 rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${service.color}`}
                            style={{ width: service.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                  <p className="text-[9px] font-semibold text-slate-700">AI Performance</p>
                  <div className="mt-2 flex h-14 items-end gap-1">
                    {[40, 55, 48, 70, 62, 80, 74].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-violet-500 to-blue-400"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[7px] text-slate-500">
                    <div>
                      <p className="font-bold text-slate-700">1,111</p>
                      <p>Responses</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">98.1%</p>
                      <p>Accuracy</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">0.8s</p>
                      <p>Avg Speed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#030508]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030508] via-[#030508]/98 to-[#0061FF]/12" />
        <div className="absolute -right-[10%] top-[5%] h-[90%] w-[70%] bg-[radial-gradient(ellipse_at_55%_45%,rgba(0,97,255,0.35)_0%,rgba(0,97,255,0.12)_40%,transparent_72%)] blur-3xl" />
        <div className="absolute right-[5%] top-[10%] h-[80%] w-[55%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,97,255,0.2)_0%,transparent_65%)] blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1720px] px-4 pb-16 pt-10 sm:px-5 sm:pb-20 sm:pt-14 lg:px-6 lg:pb-24 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8 xl:gap-10">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-200">
              AI-Powered Business Automation
            </span>

            <h1
              className={`mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-6xl ${headingFont}`}
            >
              Never Miss{" "}
              <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Another Customer
              </span>{" "}
              Again.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
              Your 24/7 AI Receptionist that answers questions, qualifies leads,
              and books appointments automatically while you focus on the work.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {FEATURE_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  <span className="text-violet-300">{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/signin"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition-opacity hover:opacity-90 sm:w-auto"
              >
                Create Your AI Assistant
                <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06] sm:w-auto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <div className="flex -space-x-2">
                {AVATARS.map((avatar) => (
                  <div
                    key={avatar.initial}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#030508] text-xs font-bold text-white ${avatar.className}`}
                  >
                    {avatar.initial}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-amber-400" aria-hidden="true">
                  ★★★★★
                </div>
                <p className="mt-0.5 text-sm text-slate-400">
                  Trusted by 2,400+ businesses
                </p>
              </div>
            </div>
          </div>

          <div className="w-full overflow-visible">
            <DashboardPreview />
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-10 lg:mt-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-2 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10 lg:max-w-6xl lg:gap-x-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-bold text-white sm:text-4xl ${headingFont}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
