"use client";

import { useState, Suspense,useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail, LineChart } from "lucide-react";

import { useAuth } from "@/app/contexts/AuthContext";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { GoogleIcon } from "@/app/components/GoogleIcon";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isAuthenticated, authInitialized } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      const next = searchParams.get("next") || "/dashboard";
      router.replace(next);
    }
  }, [authInitialized, isAuthenticated, router, searchParams]);

  const urlError = searchParams.get("error");
  const displayError =
    error ||
    (urlError === "auth"
      ? "Google sign-in could not be completed. Please try again."
      : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const next = searchParams.get("next") || "/dashboard";
      router.refresh();
      router.push(next);
    } catch (err: unknown) {
      console.error("Login error:", err);

      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error("Google login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Google login failed. Please try again."
      );
      setGoogleLoading(false);
    }
  };

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-background via-background to-primary/[0.07]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15">
            <LineChart className="h-7 w-7" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              TradeReportz
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Sign in to your trading journal.
            </p>
          </div>
        </div>

        <Card className="border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
            <CardDescription>
              Use Google for a one-tap sign in, or your email and password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {displayError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {displayError}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border/80 bg-background font-medium shadow-sm hover:bg-accent/50"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              {googleLoading ? "Opening Google…" : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/70" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground tracking-wider">
                  Or with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={loading || googleLoading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
