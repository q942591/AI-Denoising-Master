import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createSupabaseClient } from "~/lib/supabase/client";

// create and export the supabase client
export const supabase = createSupabaseClient();

// hook to get current user data and loading state
export const useCurrentUser = () => {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get initial session
    const getInitialSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getInitialSession();

    // listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isPending: loading,
    session: user ? { user } : null,
    user,
  };
};

// hook similar to getCurrentUserOrRedirect for client-side use
export const useCurrentUserOrRedirect = (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
) => {
  const { isPending, user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    // only perform redirects after loading is complete and router is ready
    if (!isPending && router) {
      // if no user is found
      if (!user) {
        // redirect to forbidden url unless explicitly ignored
        if (!ignoreForbidden) {
          router.push(forbiddenUrl);
        }
        // if ignoreforbidden is true, we do nothing and let the hook return the null user
      } else if (okUrl) {
        // if user is found and an okurl is provided, redirect there
        router.push(okUrl);
      }
    }
    // depend on loading state, user data, router instance, and redirect urls
  }, [isPending, user, router, forbiddenUrl, okUrl, ignoreForbidden]);

  return {
    isPending,
    session: user ? { user } : null,
    user,
  };
};

// auth methods
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const signInWithProvider = async (provider: "github" | "google") => {
  return await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
    provider,
  });
};
