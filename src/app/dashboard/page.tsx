"use client";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { calculateAnalytics, getEquityCurve, getPerformanceByPeriod } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Dashboard() {
  const { trades } = useTrades();
  const { user } = useAuth();

  const analytics = calculateAnalytics(trades);
  const equityCurve = getEquityCurve(trades);
  const weeklyPerformance = getPerformanceByPeriod(trades, "weekly");

  const statCards = [
    {
      title: "Total P&L",
      value: formatCurrency(analytics.totalPnL, user?.currency),
      icon: DollarSign,
      color: analytics.totalPnL >= 0 ? "text-green-500" : "text-red-500",
      bgColor:
        analytics.totalPnL >= 0
          ? "bg-gradient-to-br from-green-500 to-emerald-600"
          : "bg-gradient-to-br from-red-500 to-rose-600",
      change: analytics.totalPnL >= 0 ? "+" : "",
    },
    {
      title: "Win Rate",
      value: formatPercent(analytics.winRate),
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
      subtitle: `${analytics.winningTrades}W / ${analytics.losingTrades}L`,
    },
    {
      title: "Total Trades",
      value: analytics.totalTrades.toString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
      subtitle: "Logged trades",
    },
    {
      title: "Profit Factor",
      value: analytics.profitFactor === Infinity ? "∞" : analytics.profitFactor.toFixed(2),
      icon: Award,
      color: "text-orange-500",
      bgColor: "bg-gradient-to-br from-orange-500 to-amber-600",
      subtitle:
        analytics.profitFactor >= 2
          ? "Excellent! 🎉"
          : analytics.profitFactor >= 1.5
          ? "Good 👍"
          : "Needs work",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>

          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here's your trading overview.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group">
                  <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>

                    <div
                      className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.change}
                      {stat.value}
                    </div>

                    {stat.subtitle && <p className="text-xs text-muted-foreground">{stat.subtitle}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Equity Curve */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Your cumulative profit/loss over time</CardDescription>
            </CardHeader>

            <CardContent>
              {equityCurve.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />

                    <Tooltip />

                    <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No trade data yet. Start adding trades!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Profit/loss by week</CardDescription>
            </CardHeader>

            <CardContent>
              {weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />
                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No weekly data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average P&L</p>
                <p className="text-xl font-bold">{formatCurrency(analytics.averagePnL, user?.currency)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Best Trade</p>
                <p className="text-xl font-bold text-green-500">{formatCurrency(analytics.largestWin, user?.currency)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Worst Trade</p>
                <p className="text-xl font-bold text-red-500">{formatCurrency(analytics.largestLoss, user?.currency)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.subscriptionPlan === "free" && trades.length > 180 && (
          <Card className="border-primary">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">
                  You're approaching the 200 trade limit. Upgrade to Pro for unlimited trades and AI reports.
                </p>
              </div>

              <Link href="/pricing">
                <Button>Upgrade</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}