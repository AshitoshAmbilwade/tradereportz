"use client";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import {
  calculateAnalytics,
  getEquityCurve,
  getPerformanceByPeriod,
  getPerformanceByStrategy,
  getPerformanceBySegment,
  getPerformanceBySession,
  getPerformanceByTradeType,
  getPerformanceByDirection,
  getDayOfWeekPerformance,
} from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  BarChart2,
  Activity,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from "lucide-react";

const CHART_COLORS = [
  "#6366f1", "#8b5cf6", "#3b82f6", "#06b6d4",
  "#10b981", "#f59e0b", "#ef4444", "#ec4899",
];

interface TooltipPayload {
  value: number;
  name: string;
  color?: string;
}

interface BaseTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface PnLTooltipProps extends BaseTooltipProps {
  currency?: string;
}

function PnLTooltip({ active, payload, label, currency }: PnLTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={`font-bold ${(p.value ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {p.name}: {(p.value ?? 0) >= 0 ? "+" : ""}{formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

function GenericTooltip({ active, payload, label }: BaseTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function EmptyChart({ height = 280 }: { height?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
      style={{ height }}
    >
      <BarChart2 size={32} className="opacity-20" />
      <p className="text-sm">Not enough data</p>
    </div>
  );
}

export default function Analytics() {
  const { trades } = useTrades();
  const { user } = useAuth();
  const currency = user?.currency;

  const analytics = calculateAnalytics(trades);
  const equityCurve = getEquityCurve(trades);
  const strategyData = getPerformanceByStrategy(trades);
  const segmentData = getPerformanceBySegment(trades);
  const sessionData = getPerformanceBySession(trades);
  const tradeTypeData = getPerformanceByTradeType(trades);
  const directionData = getPerformanceByDirection(trades);
  const dayOfWeekData = getDayOfWeekPerformance(trades);

  const [periodView, setPeriodView] = useState<"daily" | "weekly" | "monthly">("weekly");
  const performanceByPeriod = getPerformanceByPeriod(trades, periodView);

  const isProfit = analytics.totalPnL >= 0;

  const metricCards = [
    {
      label: "Total P&L",
      value: formatCurrency(analytics.totalPnL, currency),
      icon: DollarSign,
      color: isProfit ? "text-emerald-500" : "text-red-500",
      bg: isProfit ? "from-emerald-500/15 to-transparent" : "from-red-500/15 to-transparent",
      iconColor: isProfit ? "bg-emerald-500" : "bg-red-500",
      sub: isProfit ? "Overall profitable" : "Overall in loss",
    },
    {
      label: "Win Rate",
      value: formatPercent(analytics.winRate),
      icon: Target,
      color: "text-blue-500",
      bg: "from-blue-500/15 to-transparent",
      iconColor: "bg-blue-500",
      sub: `${analytics.winningTrades}W / ${analytics.losingTrades}L`,
    },
    {
      label: "Profit Factor",
      value: analytics.profitFactor === Infinity ? "∞" : analytics.profitFactor.toFixed(2),
      icon: Award,
      color: "text-violet-500",
      bg: "from-violet-500/15 to-transparent",
      iconColor: "bg-violet-500",
      sub: analytics.profitFactor >= 2 ? "Excellent" : analytics.profitFactor >= 1.5 ? "Good" : "Needs improvement",
    },
    {
      label: "Total Trades",
      value: analytics.totalTrades.toString(),
      icon: BarChart2,
      color: "text-indigo-500",
      bg: "from-indigo-500/15 to-transparent",
      iconColor: "bg-indigo-500",
      sub: `${analytics.breakEvenTrades} break even`,
    },
    {
      label: "Avg Win",
      value: formatCurrency(analytics.averageWin, currency),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "from-emerald-500/15 to-transparent",
      iconColor: "bg-emerald-500",
      sub: `Best: ${formatCurrency(analytics.largestWin, currency)}`,
    },
    {
      label: "Avg Loss",
      value: formatCurrency(-analytics.averageLoss, currency),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "from-red-500/15 to-transparent",
      iconColor: "bg-red-500",
      sub: `Worst: ${formatCurrency(analytics.largestLoss, currency)}`,
    },
    {
      label: "Max Drawdown",
      value: formatCurrency(analytics.maxDrawdown, currency),
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "from-orange-500/15 to-transparent",
      iconColor: "bg-orange-500",
      sub: "Peak to trough",
    },
    {
      label: "Payoff Ratio",
      value: analytics.payoffRatio === Infinity ? "∞" : analytics.payoffRatio.toFixed(2),
      icon: Layers,
      color: "text-cyan-500",
      bg: "from-cyan-500/15 to-transparent",
      iconColor: "bg-cyan-500",
      sub: "Avg win / avg loss",
    },
    {
      label: "Max Win Streak",
      value: analytics.maxWinStreak.toString(),
      icon: Flame,
      color: "text-amber-500",
      bg: "from-amber-500/15 to-transparent",
      iconColor: "bg-amber-500",
      sub: `Max loss: ${analytics.maxLossStreak}`,
    },
    {
      label: "Current Streak",
      value:
        analytics.currentStreak.type === "none"
          ? "—"
          : `${analytics.currentStreak.count} ${analytics.currentStreak.type === "win" ? "Wins" : "Losses"}`,
      icon: analytics.currentStreak.type === "win" ? ArrowUpRight : ArrowDownRight,
      color:
        analytics.currentStreak.type === "win"
          ? "text-emerald-500"
          : analytics.currentStreak.type === "loss"
          ? "text-red-500"
          : "text-muted-foreground",
      bg:
        analytics.currentStreak.type === "win"
          ? "from-emerald-500/15 to-transparent"
          : analytics.currentStreak.type === "loss"
          ? "from-red-500/15 to-transparent"
          : "from-muted/15 to-transparent",
      iconColor:
        analytics.currentStreak.type === "win"
          ? "bg-emerald-500"
          : analytics.currentStreak.type === "loss"
          ? "bg-red-500"
          : "bg-muted-foreground",
      sub: "Active streak",
    },
    {
      label: "Avg P&L",
      value: formatCurrency(analytics.averagePnL, currency),
      icon: Activity,
      color: analytics.averagePnL >= 0 ? "text-emerald-500" : "text-red-500",
      bg: analytics.averagePnL >= 0 ? "from-emerald-500/15 to-transparent" : "from-red-500/15 to-transparent",
      iconColor: analytics.averagePnL >= 0 ? "bg-emerald-500" : "bg-red-500",
      sub: "Per trade average",
    },
    {
      label: "Break Even",
      value: formatPercent(
        analytics.totalTrades > 0
          ? (analytics.breakEvenTrades / analytics.totalTrades) * 100
          : 0
      ),
      icon: Target,
      color: "text-slate-400",
      bg: "from-slate-500/15 to-transparent",
      iconColor: "bg-slate-500",
      sub: `${analytics.breakEvenTrades} trades`,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Deep dive into your trading performance across all dimensions
          </p>
        </motion.div>

        {/* Metric Cards Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {metricCards.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card
                key={i}
                className={`border border-border/60 bg-gradient-to-br ${m.bg} hover:border-border hover:shadow-md transition-all duration-200`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-muted-foreground leading-tight">{m.label}</p>
                    <div className={`${m.iconColor} rounded-lg p-1.5 shrink-0`}>
                      <Icon size={12} className="text-white" />
                    </div>
                  </div>
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{m.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Equity Curve + Drawdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border border-border/60">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity size={16} className="text-indigo-500" />
                    Equity Curve & Drawdown
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Cumulative P&L (green) and underwater drawdown (orange)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {equityCurve.length > 1 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={equityCurve} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
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
                      width={75}
                    />
                    <Tooltip content={<PnLTooltip currency={currency} />} cursor={false} />
                    <ReferenceLine y={0} stroke="rgba(128,128,128,0.35)" strokeDasharray="4 4" />
                    <Area
                      type="monotone"
                      dataKey="equity"
                      name="Equity"
                      stroke={isProfit ? "#10b981" : "#ef4444"}
                      strokeWidth={2.5}
                      fill="url(#equityFill)"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="drawdown"
                      name="Drawdown"
                      stroke="#f97316"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0 }}
                      strokeDasharray="4 4"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart height={320} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance by Period */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border border-border/60">
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold">Performance by Period</CardTitle>
                  <CardDescription className="text-xs mt-0.5">P&L grouped by time period</CardDescription>
                </div>
                <div className="flex gap-1.5 bg-muted/50 rounded-lg p-1">
                  {(["daily", "weekly", "monthly"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodView(p)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                        periodView === p
                          ? "bg-background shadow text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {performanceByPeriod.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={performanceByPeriod} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: string) =>
                        periodView === "monthly" ? v.slice(0, 7) : v.slice(5)
                      }
                    />
                    <YAxis
                      tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                      width={75}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0];
                        const val = Number(d?.value ?? 0);
                        const entry = performanceByPeriod.find((p) => p.date === label);
                        return (
                          <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
                            <p className="text-muted-foreground font-medium">{label}</p>
                            <p className={`font-bold ${val >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                              P&L: {val >= 0 ? "+" : ""}{formatCurrency(val, currency)}
                            </p>
                            {entry && (
                              <>
                                <p className="text-muted-foreground">Trades: {entry.trades}</p>
                                <p className="text-muted-foreground">Win Rate: {entry.winRate}%</p>
                              </>
                            )}
                          </div>
                        );
                      }}
                    />
                    <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                    <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={52}>
                      {performanceByPeriod.map((entry, idx) => (
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
                <EmptyChart />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Strategy + Segment Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Strategy Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Strategy Performance</CardTitle>
                <CardDescription className="text-xs mt-0.5">P&L and win rate by strategy</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {strategyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      layout="vertical"
                      data={strategyData.slice(0, 8)}
                      margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                      />
                      <YAxis
                        type="category"
                        dataKey="strategy"
                        tick={{ fill: "rgba(128,128,128,0.8)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const pval = Number(payload[0]?.value ?? 0);
                          const d = strategyData.find((s) => s.totalPnL === pval);
                          return (
                            <div className="bg-background/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
                              <p className="font-semibold">{payload[0]?.payload?.strategy}</p>
                              <p className={`font-bold ${pval >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                P&L: {formatCurrency(pval, currency)}
                              </p>
                              {d && (
                                <>
                                  <p className="text-muted-foreground">Trades: {d.trades}</p>
                                  <p className="text-muted-foreground">Win Rate: {d.winRate}%</p>
                                </>
                              )}
                            </div>
                          );
                        }}
                      />
                      <ReferenceLine x={0} stroke="rgba(128,128,128,0.3)" />
                      <Bar dataKey="totalPnL" radius={[0, 6, 6, 0]} maxBarSize={28}>
                        {strategyData.slice(0, 8).map((entry, idx) => (
                          <Cell
                            key={idx}
                            fill={entry.totalPnL >= 0 ? "#10b981" : "#ef4444"}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Segment Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Market Segment Breakdown</CardTitle>
                <CardDescription className="text-xs mt-0.5">Trades by market segment</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {segmentData.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={segmentData}
                          dataKey="trades"
                          nameKey="segment"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {segmentData.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<GenericTooltip />} cursor={false} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2">
                      {segmentData.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                          <span className="text-muted-foreground truncate">{s.segment}</span>
                          <span className={`ml-auto font-semibold ${s.pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {s.pnl >= 0 ? "+" : ""}{formatCurrency(s.pnl, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyChart />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Session + Direction Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Session Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Performance by Session</CardTitle>
                <CardDescription className="text-xs mt-0.5">Morning, Mid Day, Last Hour</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {sessionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={sessionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                      <XAxis
                        dataKey="session"
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                        width={70}
                      />
                      <Tooltip content={<PnLTooltip currency={currency} />} cursor={false} />
                      <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                      <Bar dataKey="pnl" name="P&L" radius={[8, 8, 0, 0]} maxBarSize={56}>
                        {sessionData.map((entry, idx) => (
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
                  <EmptyChart height={240} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Direction (Long vs Short) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Long vs Short</CardTitle>
                <CardDescription className="text-xs mt-0.5">P&L and win rate by direction</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {directionData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={directionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                        <XAxis
                          dataKey="direction"
                          tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                          width={70}
                        />
                        <Tooltip content={<PnLTooltip currency={currency} />} cursor={false} />
                        <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                        <Bar dataKey="pnl" name="P&L" radius={[8, 8, 0, 0]} maxBarSize={72}>
                          {directionData.map((entry, idx) => (
                            <Cell
                              key={idx}
                              fill={entry.direction === "Long" ? "#6366f1" : "#8b5cf6"}
                              fillOpacity={0.9}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {directionData.map((d, i) => (
                        <div key={i} className="bg-muted/40 rounded-xl p-3 text-xs space-y-1">
                          <p className="font-semibold text-sm">{d.direction}</p>
                          <p className="text-muted-foreground">{d.trades} trades</p>
                          <p className={`font-bold ${d.pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {d.pnl >= 0 ? "+" : ""}{formatCurrency(d.pnl, currency)}
                          </p>
                          <p className="text-muted-foreground">Win Rate: {d.winRate}%</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyChart height={240} />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trade Type + Day of Week Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Trade Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Performance by Trade Type</CardTitle>
                <CardDescription className="text-xs mt-0.5">Intraday, Swing, Scalping…</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {tradeTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={tradeTypeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                      <XAxis
                        dataKey="type"
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                        width={70}
                      />
                      <Tooltip content={<PnLTooltip currency={currency} />} cursor={false} />
                      <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                      <Bar dataKey="pnl" name="P&L" radius={[8, 8, 0, 0]} maxBarSize={56}>
                        {tradeTypeData.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart height={250} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Day of Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <Card className="border border-border/60 h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Day of Week Performance</CardTitle>
                <CardDescription className="text-xs mt-0.5">Which days are most profitable?</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {dayOfWeekData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dayOfWeekData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => formatCurrency(v, currency).replace(/\.00$/, "")}
                          width={70}
                        />
                        <Tooltip content={<PnLTooltip currency={currency} />} cursor={false} />
                        <ReferenceLine y={0} stroke="rgba(128,128,128,0.3)" />
                        <Bar dataKey="pnl" name="P&L" radius={[6, 6, 0, 0]} maxBarSize={44}>
                          {dayOfWeekData.map((entry, idx) => (
                            <Cell
                              key={idx}
                              fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                              fillOpacity={0.85}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {dayOfWeekData.map((d, i) => (
                        <div key={i} className="text-center text-xs">
                          <p className="text-muted-foreground font-medium">{d.day}</p>
                          <p className={`font-bold text-sm mt-0.5 ${d.pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {d.winRate}%
                          </p>
                          <p className="text-muted-foreground text-[10px]">{d.trades}T</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyChart height={250} />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Win Rate vs Payoff Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="border border-border/60 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Performance Summary</CardTitle>
              <CardDescription className="text-xs">
                Key ratios at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Win Rate",
                    value: formatPercent(analytics.winRate),
                    bar: analytics.winRate,
                    color: "#3b82f6",
                    sub: "Trades won",
                  },
                  {
                    label: "Profit Factor",
                    value: analytics.profitFactor === Infinity ? "∞" : analytics.profitFactor.toFixed(2),
                    bar: Math.min(analytics.profitFactor * 33, 100),
                    color: "#8b5cf6",
                    sub: "> 1.5 is good",
                  },
                  {
                    label: "Payoff Ratio",
                    value: analytics.payoffRatio === Infinity ? "∞" : analytics.payoffRatio.toFixed(2),
                    bar: Math.min(analytics.payoffRatio * 33, 100),
                    color: "#06b6d4",
                    sub: "Avg win / avg loss",
                  },
                  {
                    label: "Expectancy",
                    value: formatCurrency(
                      (analytics.winRate / 100) * analytics.averageWin -
                        (1 - analytics.winRate / 100) * analytics.averageLoss,
                      currency
                    ),
                    bar:
                      analytics.averageWin + analytics.averageLoss > 0
                        ? Math.min(
                            Math.max(
                              ((analytics.winRate / 100) * analytics.averageWin) /
                                (analytics.averageWin + analytics.averageLoss) * 100,
                              0
                            ),
                            100
                          )
                        : 0,
                    color: "#10b981",
                    sub: "Per trade expected",
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-sm" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(Math.max(item.bar, 0), 100)}%`,
                          backgroundColor: item.color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
