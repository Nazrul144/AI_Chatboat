"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
] as const;

function LogoIcon() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#4a9fd4] to-[#2b6cb0] shadow-sm"
      aria-hidden="true"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z"
          fill="#f5c542"
          stroke="#c47a1a"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M9 21V13H15V21"
          fill="#e8e0d0"
          stroke="#c47a1a"
          strokeWidth="0.75"
        />
        <rect x="10" y="14" width="4" height="3" rx="0.5" fill="#87ceeb" />
      </svg>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M5.5 3.5C5.5 3.5 4 4.5 4 7.5C4 13 9 18 14.5 18C17.5 18 18.5 16.5 18.5 16.5L15.5 13.5C15.5 13.5 14.5 14 13.5 13C12.5 12 12 11 12 11L9 8C9 8 9.5 7 8.5 6C7.5 5 8 4 8 4L5.5 3.5Z"
        fill="#e84393"
        stroke="#e84393"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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
    <header className="border-b border-gray-300/60 bg-[#f3f4f6]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2b4b]"
        >
          <LogoIcon />
          <span className="text-base font-bold leading-tight text-[#1a2b4b] sm:text-lg">
            Summit Roof &amp; Plumbing
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-[#6b7280] transition-colors hover:text-[#1a2b4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2b4b]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          

          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#e67e22] to-[#d35400] px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d35400] sm:px-5"
          >
            Free Quote
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#1a2b4b] hover:bg-gray-200/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2b4b] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-gray-300/60 bg-[#f3f4f6] px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-200/50 hover:text-[#1a2b4b]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="tel:+15558207473"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2.5 text-sm font-semibold text-[#3b6fd4] transition-colors hover:bg-[#e0e7ff]"
          >
            <PhoneIcon />
            (555) 820-PIPE
          </a>
        </div>
      )}
    </header>
  );
}
