"use client";

import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

function getRoleFromSession(accessToken?: string): string | undefined {
  if (!accessToken) return undefined;
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return payload.user_role;
  } catch {
    return undefined;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setUserRole(getRoleFromSession(session?.access_token));
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setUserRole(getRoleFromSession(session?.access_token));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, userRole, isLoading };
}
