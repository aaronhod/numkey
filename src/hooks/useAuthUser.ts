import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isSupabaseAuth } from "@/utils/authProvider";
import { createSupabaseBrowserClient } from "@/utils/supabaseBrowser";

interface AuthUserState {
  userId: string | null;
  loading: boolean;
}

/**
 * Client-side session state (used by the header). Works for both auth
 * providers by probing /api/auth/me.
 */
export function useAuthUser() {
  const router = useRouter();
  const [state, setState] = useState<AuthUserState>({
    userId: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? (res.json() as Promise<AuthUserState>) : null))
      .then((auth) => {
        if (!cancelled) {
          setState({ userId: auth?.userId ?? null, loading: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ userId: null, loading: false });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseAuth) {
      await createSupabaseBrowserClient().auth.signOut();
    } else {
      await fetch("/api/auth/basic/logout", { method: "POST" });
    }
    setState({ userId: null, loading: false });
    await router.push("/");
    router.reload();
  }, [router]);

  return { ...state, signOut };
}
