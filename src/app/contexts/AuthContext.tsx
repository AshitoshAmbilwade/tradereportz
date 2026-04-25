"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

import type { Session, User as SupabaseAuthUser } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionPlan?: string;
  currency?: string;
  timezone?: string;
}

interface AuthContextType {
  user: User | null;
  /** True after the first `getSession()` finishes — avoids treating "still loading" as logged out. */
  authInitialized: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function displayNameFromAuthUser(authUser: SupabaseAuthUser): string {
  const meta = authUser.user_metadata ?? {};
  const fromMeta =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    (meta.preferred_username as string | undefined);
  if (fromMeta?.trim()) return fromMeta.trim();
  if (authUser.email) return authUser.email.split("@")[0] ?? "Trader";
  return "Trader";
}

function appUserFromAuthAndRow(
  authUser: SupabaseAuthUser,
  row: {
    name?: string | null;
    tier?: string | null;
    currency?: string | null;
    timezone?: string | null;
  } | null
): User {
  return {
    id: authUser.id,
    email: authUser.email ?? "",
    name: row?.name?.trim() || displayNameFromAuthUser(authUser),
    subscriptionPlan: row?.tier || "free",
    currency: row?.currency || "USD",
    timezone: row?.timezone || "UTC",
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const supabase = useMemo(() => createClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const setUserFromAuthFallback = useCallback((authUser: SupabaseAuthUser) => {
    setUser(appUserFromAuthAndRow(authUser, null));
  }, []);

  const loadOrCreateProfile = useCallback(
    async (authUser: SupabaseAuthUser) => {
      const { data: row, error: selectError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (selectError) {
        console.error("Profile fetch error", selectError);
        setUserFromAuthFallback(authUser);
        return;
      }

      if (!row) {
        const insertPayload = {
          id: authUser.id,
          name: displayNameFromAuthUser(authUser),
          ...(authUser.email ? { email: authUser.email } : {}),
          tier: "free",
          currency: "USD",
          timezone: "UTC",
        };

        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert(insertPayload, { onConflict: "id" });

        if (upsertError) {
          console.error("Profile upsert error", upsertError);
          setUser(appUserFromAuthAndRow(authUser, insertPayload));
          return;
        }

        setUser(appUserFromAuthAndRow(authUser, insertPayload));
        return;
      }

      setUser(appUserFromAuthAndRow(authUser, row));
    },
    [supabase, setUserFromAuthFallback]
  );

  useEffect(() => {
    const scheduleProfileSync = (authUser: SupabaseAuthUser) => {
      setTimeout(() => {
        void loadOrCreateProfile(authUser);
      }, 0);
    };

    const init = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        if (initialSession?.user) {
          scheduleProfileSync(initialSession.user);
        }
      } finally {
        setAuthInitialized(true);
      }
    };

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user) {
          scheduleProfileSync(nextSession.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, loadOrCreateProfile]);

  const signup = async (
    email: string,
    password: string,
    name: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/dashboard`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) throw error;
  };

  const signupWithGoogle = async () => {
    await signInWithGoogle();
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authInitialized,
        signup,
        signupWithGoogle,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
