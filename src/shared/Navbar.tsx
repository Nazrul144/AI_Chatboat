"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
] as const;

const headingFont = "font-[family-name:var(--font-plus-jakarta)]";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6L18 18M6 18L18 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7H20M4 12H20M4 17H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070d1f]/75 backdrop-blur-xl">
      <nav
        className="relative mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`shrink-0 text-lg font-bold text-white sm:text-xl ${headingFont}`}
        >
          NexFlow AI
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/signin"
            className="hidden rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Register Now
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-white/[0.06] bg-[#070d1f] px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/signin"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register Now
          </Link>
        </div>
      )}
    </header>
  );
}
