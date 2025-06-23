// note: run `bun db:auth` to generate the `users.ts`
// schema after making breaking changes to this file

import type { User } from "@supabase/supabase-js";

import { redirect } from "next/navigation";

// import { SYSTEM_CONFIG } from "~/app";
import { createSupabaseServerClient } from "~/lib/supabase/server";

export type UserDbType = User;

// get current user from supabase
export const getCurrentUser = async (): Promise<null | UserDbType> => {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

// get current user or redirect
export const getCurrentUserOrRedirect = async (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
): Promise<null | UserDbType> => {
  const user = await getCurrentUser();

  // if no user is found
  if (!user) {
    // redirect to forbidden url unless explicitly ignored
    if (!ignoreForbidden) {
      redirect(forbiddenUrl);
    }
    return null;
  }

  // if user is found and an okurl is provided, redirect there
  if (okUrl) {
    redirect(okUrl);
  }

  return user;
};

// sign out function
export const signOut = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
};
