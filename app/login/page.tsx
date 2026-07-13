import Link from "next/link";
import { CircleAlert, MailCheck } from "lucide-react";
import { supabaseConfigured } from "@/lib/supabase/server";
import { forgotPassword, signIn, signUp } from "./actions";

export const metadata = { title: "Sign in — Marketcap" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const configured = supabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-9 w-9 grid-cols-2 gap-[3px] rounded-xl bg-accent p-2">
            <span className="rounded-full bg-white" />
            <span className="rounded-full bg-white" />
            <span className="rounded-full bg-white" />
            <span className="rounded-full bg-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Marketcap</span>
        </div>

        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to your trading account — or create one and get{" "}
          <span className="font-semibold text-ink">$100,000 in virtual cash</span> to practice
          trading real stocks, risk-free.
        </p>

        {!configured && (
          <p className="mt-4 rounded-xl bg-negative-soft p-3 text-sm text-negative">
            Supabase isn&apos;t configured yet — add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart.
          </p>
        )}
        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-negative-soft p-3 text-sm text-negative">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-positive-soft p-3 text-sm text-positive">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        <form className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent"
            />
          </label>
          <div className="mt-2 flex gap-3">
            <button
              formAction={signIn}
              className="flex-1 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign in
            </button>
            <button
              formAction={signUp}
              className="flex-1 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-background"
            >
              Create account
            </button>
          </div>
          <button
            formAction={forgotPassword}
            formNoValidate
            className="self-center text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Forgot password?
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-ink">
          ← Back to dashboard
        </Link>
      </div>
    </main>
  );
}
