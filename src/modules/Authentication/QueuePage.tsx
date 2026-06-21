"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const headingFont = "font-[family-name:var(--font-plus-jakarta)]";

function QueueIcon() {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-violet-500/20" />
      <div className="absolute inset-2 rounded-full border border-violet-500/30" />
      <div className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/30 ring-1 ring-violet-400/30">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" className="text-violet-200" />
          <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-violet-200" />
        </svg>
      </div>
    </div>
  );
}

function StatusItem({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3">
      {done ? (
        <>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm text-emerald-400">{label}</span>
        </>
      ) : (
        <>
          <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span className="text-sm text-slate-400">{label}</span>
        </>
      )}
    </li>
  );
}

export default function QueuePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b14] px-4 py-10 text-white">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1120] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <QueueIcon />

          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Pending Admin Approval
            </span>
          </div>

          <h1 className={`mt-6 text-center text-3xl font-bold sm:text-4xl ${headingFont}`}>
            You&apos;re in the Queue!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-slate-400 sm:text-[15px]">
            Your registration is complete. Our team is reviewing your business
            details to activate your AI assistant.
          </p>

          <div className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-4 sm:px-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-white">Estimated Review Time</p>
                <p className="mt-0.5 text-sm text-amber-300">
                  Usually within 2–4 business hours
                </p>
              </div>
            </div>
          </div>

          <ul className="mx-auto mt-8 flex max-w-sm flex-col gap-4">
            <StatusItem done label="Business profile saved" />
            <StatusItem done label="Email verified" />
            <StatusItem done={false} label="Account under admin review" />
            <StatusItem done={false} label="Approval notification sent to team" />
          </ul>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 sm:px-5">
            <span className="mt-0.5 shrink-0 text-violet-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 4C9.5 4 8 5.8 8 8.2V11.5C8 13.2 7.2 14.8 6 16H18C16.8 14.8 16 13.2 16 11.5V8.2C16 5.8 14.5 4 12 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M10 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-sm leading-relaxed text-slate-400">
              We&apos;ll email you at{" "}
              <span className="font-semibold text-white">{email}</span> the moment
              your account is approved. Check your spam folder too.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to home
      </Link>
    </div>
  );
}
