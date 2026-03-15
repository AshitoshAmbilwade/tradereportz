"use client";

import { useState } from "react";

import Layout from "@/app/components/Layout";
import { useAuth } from "@/app/contexts/AuthContext";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

import { Award, Target, User, CreditCard } from "lucide-react";

export default function Settings() {

  const { user } = useAuth();

  const [goals, setGoals] = useState({
    maxTradesPerDay: "3",
    maxRiskPerTrade: "2",
    targetWinRate: "60",
    monthlyProfitTarget: "5000",
  });

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem(
      `tradereportz_goals_${user?.id}`,
      JSON.stringify(goals)
    );

    alert("Goals saved successfully!");
  };

  const achievements = [
    { id: 1, title: "First Trade", description: "Log your first trade", unlocked: true },
    { id: 2, title: "10 Trades", description: "Complete 10 trades", unlocked: true },
    { id: 3, title: "100 Trades", description: "Complete 100 trades", unlocked: false },
    { id: 4, title: "First Profitable Month", description: "Achieve a profitable month", unlocked: false },
    { id: 5, title: "Consistency", description: "Trade for 30 consecutive days", unlocked: false },
    { id: 6, title: "Risk Master", description: "Maintain risk below 2% for 50 trades", unlocked: false },
  ];

  return (
    <Layout>

      <div className="space-y-6">

        <div>
          <h2 className="text-3xl font-bold mb-2">
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* PROFILE */}

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">

            <Input value={user?.name || ""} disabled />
            <Input value={user?.email || ""} disabled />

          </CardContent>
        </Card>

        {/* SUBSCRIPTION */}

        <Card>

          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>

          <CardContent className="flex justify-between items-center">

            <div>
              <p className="font-semibold">
                {user?.subscriptionPlan?.toUpperCase()} Plan
              </p>
            </div>

            {user?.subscriptionPlan === "free" ? (
              <Button>Upgrade to Pro</Button>
            ) : (
              <Button variant="outline">
                Manage Subscription
              </Button>
            )}

          </CardContent>

        </Card>

        {/* GOALS */}

        <Card>

          <CardHeader>
            <CardTitle>Trading Goals</CardTitle>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSaveGoals}
              className="grid md:grid-cols-2 gap-4"
            >

              <Input
                type="number"
                value={goals.maxTradesPerDay}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    maxTradesPerDay: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                value={goals.maxRiskPerTrade}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    maxRiskPerTrade: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                value={goals.targetWinRate}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    targetWinRate: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                value={goals.monthlyProfitTarget}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    monthlyProfitTarget: e.target.value,
                  })
                }
              />

              <Button type="submit">
                Save Goals
              </Button>

            </form>

          </CardContent>

        </Card>

        {/* ACHIEVEMENTS */}

        <Card>

          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">

            {achievements.map((a) => (

              <div
                key={a.id}
                className={`p-4 border rounded ${
                  a.unlocked
                    ? "border-primary"
                    : "opacity-50"
                }`}
              >
                <p className="font-semibold">
                  {a.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {a.description}
                </p>
              </div>

            ))}

          </CardContent>

        </Card>

      </div>

    </Layout>
  );
}