"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            TradeReportz
          </h1>

          <p className="text-muted-foreground">
            Create your account and start trading smarter.
          </p>
        </div>

        <Card>

          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a free account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Full Name
                </label>

                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Email
                </label>

                <Input
                  type="email"
                  placeholder="trader@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Confirm Password
                </label>

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>

              </div>

            </form>

          </CardContent>

        </Card>

        <div className="mt-6 text-center">

          <Link href="/">
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>

        </div>

      </div>
    </div>
  );
}