"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitBusinessRegistration } from "@/lib/registration";

const signUpSchema = z
  .object({
    username: z.string(),
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
    website: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value ||
          value.trim() === "" ||
          /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(value.trim()),
        "Enter a valid website URL",
      ),
    businessDescription: z
      .string()
      .min(1, "Business description is required")
      .min(20, "Please write at least 20 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const defaultValues: SignUpFormValues = {
  username: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  businessDescription: "",
  password: "",
  confirmPassword: "",
};

const headingFont = "font-[family-name:var(--font-plus-jakarta)]";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3L21 21M10.6 10.6C10.2 11 10 11.5 10 12C10 13.1 10.9 14 12 14C12.5 14 13 13.8 13.4 13.4M6.7 6.7C4.9 8 3.5 10 3 12C3 12 6.5 19 12 19C14.2 19 16.1 18.2 17.6 17M9.9 5.1C10.6 5 11.3 5 12 5C18.5 5 22 12 22 12C21.6 13 20.9 14.2 20 15.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-indigo-300 transition-colors hover:border-indigo-400/30 hover:bg-white/10 hover:text-indigo-200"
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
  );
}

function ConnectorLine() {
  return (
    <div className="relative h-12">
      <div
        className="absolute left-[2.75rem] top-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-white/[0.06]"
        aria-hidden="true"
      />
    </div>
  );
}

function StepCard({
  icon,
  iconClassName,
  title,
  subtitle,
}: {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0b1120] px-5 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/[0.04]">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-base font-semibold text-white ${headingFont}`}>
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function TrustBadge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0b1120] px-3 py-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/[0.04]">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-3 text-[11px] font-medium leading-tight text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const username = useWatch({ control, name: "username" });

  const onSubmit = async (data: SignUpFormValues) => {
    setSubmitError(null);

    try {
      await submitBusinessRegistration({
        username: data.username,
        password: data.password,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        website: data.website,
      });

      const params = new URLSearchParams({ email: data.email });
      router.push(`/queue?${params.toString()}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#141c2e] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/15";

  const labelClass = "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <BackButton />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:mt-10 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {/* Left: form */}
          <div className="min-w-0">
            <p className={`text-base font-semibold text-white ${headingFont}`}>
              NexFlow AI
            </p>

            <div className="mt-5 sm:mt-6">
              <h1
                className={`text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem] ${headingFont}`}
              >
                Create Your AI Receptionist
              </h1>
              <p className="mt-3 text-sm text-slate-400 sm:text-[15px]">
                Set business in minutes. No credit card required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className={labelClass}>
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="eliteplumbing"
                    className={inputClass}
                    {...register("username")}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    nexflow.ai/
                    <span className="text-violet-400">
                      {username?.trim() || "yourbusiness"}
                    </span>
                  </p>
                  <FieldError message={errors.username?.message} />
                </div>

                <div>
                  <label htmlFor="businessName" className={labelClass}>
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    placeholder="Elite Plumbing Pro"
                    className={inputClass}
                    {...register("businessName")}
                  />
                  <FieldError message={errors.businessName?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@business.com"
                    className={inputClass}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="01212121221"
                    className={inputClass}
                    {...register("phone")}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>

              <div>
                <label htmlFor="website" className={labelClass}>
                  Website URL{" "}
                  <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <input
                  id="website"
                  type="text"
                  placeholder="eliteplumbingpro.com"
                  className={inputClass}
                  {...register("website")}
                />
                <FieldError message={errors.website?.message} />
              </div>

              <div>
                <label htmlFor="businessDescription" className={labelClass}>
                  Business Description
                </label>
                <textarea
                  id="businessDescription"
                  rows={4}
                  placeholder="We provide expert plumbing support, 24/7 emergency services, and competitive pricing..."
                  className={`${inputClass} min-h-[120px] resize-y`}
                  {...register("businessDescription")}
                />
                <FieldError message={errors.businessDescription?.message} />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className={`${inputClass} pr-11`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      className={`${inputClass} pr-11`}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                  <FieldError message={errors.confirmPassword?.message} />
                </div>
              </div>

              {submitError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create My AI Assistant
                <span aria-hidden="true">{isSubmitting ? "…" : "→"}</span>
              </button>
            </form>
          </div>

          {/* Right: How it works — vertically centered beside the form */}
          <aside className="flex min-w-0 flex-col justify-center lg:self-center">
            <div className="w-full max-w-md lg:mx-auto lg:max-w-none">
              <h2 className={`text-2xl font-bold text-white ${headingFont}`}>
                How it works
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                From registration to live AI in under 3 minutes
              </p>

              <div className="mt-8">
                <StepCard
                  title="Business Owner"
                  subtitle="You fill in your details"
                  iconClassName="bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/25"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 21V9L12 4L20 9V21H4Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path d="M9 21V13H15V21" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  }
                />

                <ConnectorLine />

                <StepCard
                  title="AI Training"
                  subtitle="Our system learns your business"
                  iconClassName="bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/25"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M9 9H15M9 12H15M9 15H12" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  }
                />

                <ConnectorLine />

                <StepCard
                  title="AI Assistant Created"
                  subtitle="Your 24/7 receptionist goes live"
                  iconClassName="bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/25"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="13" r="1" fill="currentColor" />
                      <circle cx="14" cy="13" r="1" fill="currentColor" />
                      <path d="M12 4V8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  }
                />
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                <TrustBadge
                  label="SOC 2 Type II"
                  icon={<span className="text-2xl">🔒</span>}
                />
                <TrustBadge
                  label="GDPR Ready"
                  icon={
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400 ring-1 ring-emerald-400/30">
                      ✓
                    </span>
                  }
                />
                <TrustBadge
                  label="99.9% Uptime"
                  icon={<span className="text-2xl text-amber-400">⚡</span>}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

