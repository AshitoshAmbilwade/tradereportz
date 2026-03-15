"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

import {
  TrendingUp,
  BarChart3,
  Brain,
  Target,
  Award,
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Trade Journaling",
      description:
        "Track every trade with detailed entries including entry/exit prices, emotions, and notes.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive performance metrics including win rate, profit factor, and equity curves.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get intelligent analysis of your trading patterns and personalized improvement suggestions.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set trading goals and track your progress with visual dashboards.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Gamification",
      description:
        "Earn achievements and stay motivated as you hit trading milestones.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: FileText,
      title: "AI Reports",
      description:
        "Automatic weekly and monthly reports analyzing your trading behavior.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Traders" },
    { value: "1M+", label: "Trades Analyzed" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "$2M+", label: "Profits Tracked" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Header */}
      <header className="relative border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            TradeReportz
          </h1>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto px-6 py-20 lg:py-32 text-center max-w-4xl">
        <motion.h2
          className="text-5xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Transform Your Trading
          </span>
        </motion.h2>

        <p className="text-xl text-muted-foreground mb-10">
          Track trades, analyze performance, and get AI-powered insights to
          improve your strategy.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>

          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card key={index}>
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                  >
                    <Icon className="text-white" size={26} />
                  </div>

                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h3 className="text-4xl font-bold mb-4">
              Ready to Improve Your Trading?
            </h3>

            <p className="mb-6">
              Join thousands of traders using TradeReportz.
            </p>

            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>

            <p className="text-sm mt-4 opacity-80">
              <Shield className="inline mr-2" size={14} />
              No credit card required
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background/80">
        <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">
          © 2026 TradeReportz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}