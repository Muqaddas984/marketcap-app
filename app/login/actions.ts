"use server";

import { revalidatePath } from "next/cache";
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
