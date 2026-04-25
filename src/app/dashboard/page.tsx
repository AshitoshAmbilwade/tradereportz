"use client";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import {
  calculateAnalytics,
  getEquityCurve,
  getPerformanceByPeriod,
  getPerformanceByTradeType,
} from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp, DollarSign, Target, Award, Zap, ArrowUpRight, ArrowDownRight, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

const SEGMENT_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#3b82f6",
  "#06b6d4", "#10b981", "#f59e0b", "#ef4444",
];

interface TooltipPayload {
  value: number;
  name: string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  currency?: string;
}

function EquityTooltip({ active, payload, label, currency }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-bold ${val >= 0 ? "text-emerald-500" : "text-red-500"}`}>
        {formatCurrency(val, currency)}
      </p>
    </div>
  );
}

function BarTooltip({ active, payload, label, currency }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-bold ${val >= 0 ? "text-emerald-500" : "text-red-500"}`}>
        {val >= 0 ? "+" : ""}{formatCurrency(val, currency)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { trades } = useTrades();
  const { user } = useAuth();
  const currency = user?.currency;

  const analytics = calculateAnalytics(trades);
  const equityCurve = getEquityCurve(trades);
  const weeklyPerformance = getPerformanceByPeriod(trades, "weekly");
  const tradeTypeData = getPerformanceByTradeType(trades);

  const isProfit = analytics.totalPnL >= 0;
  const streakLabel =
    analytics.currentStreak.type === "none"
      ? "—"
      : `${analytics.currentStreak.count} ${analytics.currentStreak.type === "win" ? "W" : "L"}`;

  const statCards = [
    {
      title: "Total P&L",
      value: formatCurrency(analytics.totalPnL, currency),
      icon: DollarSign,
      color: isProfit ? "text-emerald-500" : "text-red-500",
      bg: isProfit
        ? "from-emerald-500/20 to-emerald-600/5"
        : "from-red-500/20 to-red-600/5",
      iconBg: isProfit
        ? "bg-emerald-500"
        : "bg-red-500",
      badge: isProfit ? "Profitable" : "In Loss",
      badgeColor: isProfit ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10",
      Arrow: isProfit ? ArrowUpRight : ArrowDownRight,
    },
    {
      title: "Win Rate",
      value: formatPercent(analytics.winRate),
      icon: Target,
      color: "text-blue-500",
      bg: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-blue-500",
      badge: `${analytics.winningTrades}W / ${analytics.losingTrades}L`,
      badgeColor: "text-blue-500 bg-blue-500/10",
      Arrow: ArrowUpRight,
    },
    {
      title: "Total Trades",
      value: analytics.totalTrades.toString(),
      icon: BarChart2,
      color: "text-violet-500",
      bg: "from-violet-500/20 to-violet-600/5",
      iconBg: "bg-violet-500",
      badge: "Logged",
      badgeColor: "text-violet-500 bg-violet-500/10",
      Arrow: TrendingUp,
    },
    {
      title: "Profit Factor",
      value:
        analytics.profitFactor === Infinity
          ? "∞"
          : analytics.profitFactor.toFixed(2),
      icon: Award,
      color: "text-amber-500",
      bg: "from-amber-500/20 to-amber-600/5",
      iconBg: "bg-amber-500",
      badge:
        analytics.profitFactor >= 2
          ? "Excellent"
          : analytics.profitFactor >= 1.5
          ? "Good"
          : analytics.profitFactor > 0
          ? "Needs Work"
          : "—",
      badgeColor: "text-amber-500 bg-amber-500/10",
      Arrow: TrendingUp,
    },
  ];

  const isEmpty = trades.length === 0;

  return (
    <Layout>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                {user?.name ?? "Trader"}
              </span>{" "}
              👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link href="/trades">
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-500/25">
              <Zap size={16} className="mr-2" />
              Add Trade
            </Button>
          </Link>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            const Arrow = s.Arrow;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <Card className={`relative overflow-hidden border border-border/60 bg-gradient-to-br ${s.bg} hover:border-border transition-all duration-300 hover:shadow-lg`}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2 pt-4 px-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{s.title}</p>
                      <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                    <div className={`${s.iconBg} rounded-xl p-2.5 shadow-lg`}>
                      <Icon size={18} className="text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${s.badgeColor}`}>
                      <Arrow size={12} />
                      {s.badge}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Equity Curve */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Activity size={16} className="text-indigo-500" />
                      Equity Curve
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">Cumulative P&L over time</CardDescription>
                  </div>
                  {!isEmpty && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isProfit ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                      {isProfit ? "+" : ""}{formatCurrency(analytics.totalPnL, currency)}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {!isEmpty ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={equityCurve} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: string) => v.slice(5)}
                      />
                      <YAxis
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                        width={70}
                      />
                      <Tooltip content={<EquityTooltip currency={currency} />} cursor={false} />
                      <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" strokeDasharray="4 4" />
                      <Area
                        type="monotone"
                        dataKey="equity"
                        stroke={isProfit ? "#10b981" : "#ef4444"}
                        strokeWidth={2.5}
                        fill="url(#equityGrad)"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Activity size={40} className="opacity-20" />
                    <p className="text-sm">No trades yet. Start adding trades to see your equity curve.</p>
                    <Link href="/trades">
                      <Button size="sm" variant="outline">Add Your First Trade</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trade Type Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Trade Types</CardTitle>
                <CardDescription className="text-xs mt-0.5">Distribution by type</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {tradeTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={tradeTypeData}
                        dataKey="trades"
                        nameKey="type"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {tradeTypeData.map((_, idx) => (
                          <Cell key={idx} fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0];
                          return (
                            <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-3 py-2 shadow-xl text-xs">
                              <p className="font-semibold">{d?.name}</p>
                              <p className="text-muted-foreground">{d?.value} trades</p>
                            </div>
                          );
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border border-border/60">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Weekly Performance</CardTitle>
                  <CardDescription className="text-xs mt-0.5">P&L per week</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {weeklyPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyPerformance} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis
                      tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                      width={70}
                    />
                    <Tooltip content={<BarTooltip currency={currency} />} cursor={false} />
                    <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                    <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {weeklyPerformance.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  No weekly data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <Card className="border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Performance Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    label: "Avg P&L",
                    value: formatCurrency(analytics.averagePnL, currency),
                    color: analytics.averagePnL >= 0 ? "text-emerald-500" : "text-red-500",
                  },
                  {
                    label: "Best Trade",
                    value: formatCurrency(analytics.largestWin, currency),
                    color: "text-emerald-500",
                  },
                  {
                    label: "Worst Trade",
                    value: formatCurrency(analytics.largestLoss, currency),
                    color: "text-red-500",
                  },
                  {
                    label: "Max Drawdown",
                    value: formatCurrency(analytics.maxDrawdown, currency),
                    color: "text-orange-500",
                  },
                  {
                    label: "Payoff Ratio",
                    value:
                      analytics.payoffRatio === Infinity
                        ? "∞"
                        : analytics.payoffRatio.toFixed(2),
                    color: "text-blue-500",
                  },
                  {
                    label: "Streak",
                    value: streakLabel,
                    color:
                      analytics.currentStreak.type === "win"
                        ? "text-emerald-500"
                        : analytics.currentStreak.type === "loss"
                        ? "text-red-500"
                        : "text-muted-foreground",
                  },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Banner */}
        {user?.subscriptionPlan === "free" && trades.length > 180 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 border-violet-500/40 bg-gradient-to-r from-violet-500/10 to-blue-500/10">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-base">Upgrade to Pro</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    You&apos;re approaching the 200 trade limit. Upgrade for unlimited trades and AI reports.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white shrink-0">
                    Upgrade Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
