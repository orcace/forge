import type { JSX } from "react";
import { Link, useLocation } from "react-router";
import { LockKeyhole, ScrollText, ShieldCheck } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";

const privacySections = [
  {
    body: "Forge is designed as a local-first developer workstation. Tool input such as JWTs, secrets, payloads, source snippets, encoded text, and generated values is processed in your browser whenever the tool supports local execution.",
    title: "Local-first processing",
  },
  {
    body: "Forge may store tool drafts, theme preference, sidebar preference, and recent workspace state in browser storage on this device. This keeps workflows convenient without requiring an account.",
    title: "Browser storage",
  },
  {
    body: "Do not paste production secrets unless you understand the environment you are running Forge in. If you deploy Forge yourself, your hosting, telemetry, proxy, browser extension, or network policies may affect privacy.",
    title: "Sensitive content",
  },
  {
    body: "Support links may open email, GitHub, or LinkedIn. Information you choose to send through those services is handled by those providers and by the repository maintainers receiving it.",
    title: "External services",
  },
];

const termsSections = [
  {
    body: "Forge is provided as a developer utility. You are responsible for checking outputs before using them in production systems, security-sensitive flows, or customer-facing environments.",
    title: "Use at your own discretion",
  },
  {
    body: "Generated passwords, JWT secrets, UUIDs, hashes, timestamps, encodings, and conversions should be validated against your own security, compliance, and application requirements.",
    title: "Generated output",
  },
  {
    body: "Forge is not a legal, compliance, cryptography, or security audit service. Treat it as a local tool that helps you inspect and transform data faster.",
    title: "No professional advice",
  },
  {
    body: "When you report issues or share feedback, avoid posting private tokens, customer data, credentials, or proprietary source code in public GitHub issues.",
    title: "Responsible reporting",
  },
];

export function LegalPage(): JSX.Element {
  const location = useLocation();
  const isTerms = location.pathname === "/terms";
  const sections = isTerms ? termsSections : privacySections;

  return (
    <MainLayout
      eyebrow="Trust"
      subtitle={
        isTerms
          ? "The expectations for using Forge as a local developer utility."
          : "How Forge treats local workspace data and sensitive developer input."
      }
      title={isTerms ? "Terms of Use" : "Privacy"}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/[0.03]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              {isTerms ? (
                <ScrollText aria-hidden="true" className="h-5 w-5" />
              ) : (
                <LockKeyhole aria-hidden="true" className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {isTerms ? "Practical terms for practical tools" : "Private by default"}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {isTerms
                  ? "Forge is built to make everyday developer work calmer and faster, but it does not replace careful review of security-sensitive output."
                  : "Forge is most useful with sensitive text because its core tools are intended to run locally, close to your browser session and away from unnecessary accounts."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {sections.map((section) => (
              <section
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
                key={section.title}
              >
                <h3 className="text-[14px] font-semibold text-slate-950">
                  {section.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03]">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-950">
            Sensitive data checklist
          </h2>
          <ul className="mt-3 grid gap-2 text-[13px] leading-5 text-slate-600">
            <li>Use local or trusted deployments for private payloads.</li>
            <li>Redact secrets before opening public support requests.</li>
            <li>Rotate any credential accidentally shared outside your device.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-white px-3 text-xs font-medium text-foreground shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
              to={isTerms ? "/privacy" : "/terms"}
            >
              {isTerms ? "Read privacy" : "Read terms"}
            </Link>
            <Link
              className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-white px-3 text-xs font-medium text-foreground shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
              to="/support/ask"
            >
              Ask a question
            </Link>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}
