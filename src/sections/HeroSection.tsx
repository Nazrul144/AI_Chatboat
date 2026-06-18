"use client";

import { useState, type FormEvent } from "react";
import { useChatbot } from "@/components/chatbot";

const SERVICE_OPTIONS = [
  "Roof Repair",
  "Roof Replacement",
  "Plumbing Repair",
  "Emergency Service",
  "Inspection",
] as const;

function PhoneOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.5C5.5 3.5 4 4.5 4 7.5C4 13 9 18 14.5 18C17.5 18 18.5 16.5 18.5 16.5L15.5 13.5C15.5 13.5 14.5 14 13.5 13C12.5 12 12 11 12 11L9 8C9 8 9.5 7 8.5 6C7.5 5 8 4 8 4L5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatOutlineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5C21 16.75 16.75 21 11.5 21C10.1 21 8.75 20.7 7.55 20.15L3 21L3.85 16.45C3.3 15.25 3 13.9 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 21 7.25 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroSection() {
  const { openChatbot } = useChatbot();
  const [form, setForm] = useState({
    name: "",
    email: "",
    zipCode: "",
    serviceType: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Demo only — wire to API later
    console.log("Quote request:", form);
  };

  return (
    <section className="bg-[#f3f4f6] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        {/* Emergency banner */}
        <div className="rounded-2xl bg-[#e67e22] px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Need help right now?
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                Call our 24/7 emergency line or chat with Summit Assistant for
                instant answers.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href="tel:+15558207473"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <PhoneOutlineIcon />
                Call Emergency Line
              </a>
              <button
                type="button"
                onClick={openChatbot}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1a2b4b] transition-colors hover:bg-gray-100"
              >
                <ChatOutlineIcon />
                Open Chatbot
              </button>
            </div>
          </div>
        </div>

        {/* Quote form */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-[#1a2b4b] sm:text-3xl">
            Get Your Free Quote
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] sm:text-base">
            We respond within 30 minutes during business hours.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8"
          >
            <div className="space-y-5 text-left">
              <div>
                <label
                  htmlFor="quote-name"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Name
                </label>
                <input
                  id="quote-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#e67e22] focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-email"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Email
                </label>
                <input
                  id="quote-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#e67e22] focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-zip"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Zip Code
                </label>
                <input
                  id="quote-zip"
                  type="text"
                  required
                  value={form.zipCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#e67e22] focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-service"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Service Type
                </label>
                <select
                  id="quote-service"
                  required
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serviceType: e.target.value,
                    }))
                  }
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-[#e67e22] focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-[#e67e22] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Submit Quote Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
