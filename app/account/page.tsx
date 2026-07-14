import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { SubmitButton } from "@/components/submit-button";
import { updatePassword } from "./actions";

export const metadata = { title: "Account — Marketcap" };

const inputClass =
  "rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const user = await getUser();
  if (!user) redirect("/login");
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen">
      <Sidebar email={user.email ?? null} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <div className="max-w-lg rounded-2xl border border-line bg-card p-6">
          <h1 className="text-lg font-bold">Account</h1>
          <p className="mt-1 text-sm text-muted">
            Signed in as <span className="font-semibold text-ink">{user.email}</span>
          </p>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-negative-soft p-3 text-sm text-negative">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          {message && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-positive-soft p-3 text-sm text-positive">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              {message}
            </p>
          )}

          <h2 className="mt-6 text-sm font-bold">Change password</h2>
          <form action={updatePassword} className="mt-3 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              New password
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Confirm new password
              <input
                type="password"
                name="confirm"
                required
                minLength={6}
                placeholder="Repeat the new password"
                className={inputClass}
              />
            </label>
            <SubmitButton
              pendingText="Updating…"
              className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Update password
            </SubmitButton>
          </form>
        </div>

        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}
