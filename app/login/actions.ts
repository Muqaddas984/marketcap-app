"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/login?error=Email and password are required");
  return { email, password };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured yet");

  const { error } = await supabase.auth.signInWithPassword(credentials(formData));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured yet");

  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/login?error=Type your email above first, then click Forgot password");

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/auth/confirm?next=/account`,
  });

  // Always report success so the form can't be used to probe which emails exist.
  redirect(
    `/login?message=${encodeURIComponent(
      "If that email has an account, a password reset link is on its way — check your inbox"
    )}`
  );
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured yet");

  const { data, error } = await supabase.auth.signUp(credentials(formData));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  // If email confirmation is disabled, the user is signed in immediately.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }
  redirect("/login?message=Check your email to confirm your account, then sign in");
}
