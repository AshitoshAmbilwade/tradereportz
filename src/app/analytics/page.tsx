"use client";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

import {
  calculateAnalytics,
  getEquityCurve,
  getPerformanceByPeriod,
  getPerformanceByStrategy,
  getPerformanceByAsset,
} from "@/lib/analytics";

import { formatCurrency, formatPercent } from "@/lib/utils";

import {
  LineChart,
  Line,
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
} from "recharts";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";

export default function Analytics() {
  const { trades } = useTrades();
  const { user } = useAuth();

  const analytics = calculateAnalytics(trades);
  const equityCurve = getEquityCurve(trades);

  const [periodView, setPeriodView] = useState<"daily" | "weekly" | "monthly">("weekly");

  const performanceByPeriod = getPerformanceByPeriod(trades, periodView);
  const strategyPerformance = getPerformanceByStrategy(trades);
  const assetPerformance = getPerformanceByAsset(trades);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics</h2>
          <p className="text-muted-foreground">Deep dive into your trading performance</p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analytics.totalTrades}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-500">{formatPercent(analytics.winRate)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.winningTrades}W / {analytics.losingTrades}L
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${analytics.totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(analytics.totalPnL, user?.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-500">
                {analytics.profitFactor === Infinity ? "∞" : analytics.profitFactor.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${analytics.averagePnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(analytics.averagePnL, user?.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg RRR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-500">{analytics.averageRRR.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(analytics.maxDrawdown, user?.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Best Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(analytics.largestWin, user?.currency)}
              </p>
              {analytics.bestTrade && (
                <p className="text-xs text-muted-foreground mt-1">{analytics.bestTrade.symbol}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Equity Curve */}
        <Card>
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <CardDescription>Your cumulative performance over time</CardDescription>
          </CardHeader>

          <CardContent>
            {equityCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Period */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance by Period</CardTitle>
                <CardDescription>View your results across timeframes</CardDescription>
              </div>

              <div className="flex gap-2">
                <Button variant={periodView === "daily" ? "default" : "outline"} size="sm" onClick={() => setPeriodView("daily")}>
                  Daily
                </Button>

                <Button variant={periodView === "weekly" ? "default" : "outline"} size="sm" onClick={() => setPeriodView("weekly")}>
                  Weekly
                </Button>

                <Button variant={periodView === "monthly" ? "default" : "outline"} size="sm" onClick={() => setPeriodView("monthly")}>
                  Monthly
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {performanceByPeriod.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategy + Asset */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Strategy</CardTitle>
              <CardDescription>Which strategies work best?</CardDescription>
            </CardHeader>

            <CardContent>
              {strategyPerformance.length > 0 ? (
                <div className="space-y-4">
                  {strategyPerformance.map((strategy) => (
                    <div key={strategy.strategy} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{strategy.strategy}</span>
                        <span className={strategy.totalPnL >= 0 ? "text-green-500" : "text-red-500"}>
                          {formatCurrency(strategy.totalPnL, user?.currency)}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Win Rate: {strategy.winRate}% ({strategy.wins}W / {strategy.losses}L)
                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${strategy.winRate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No strategy data
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Asset</CardTitle>
              <CardDescription>Which assets are most profitable?</CardDescription>
            </CardHeader>

            <CardContent>
              {assetPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={assetPerformance} dataKey="pnl" nameKey="asset" cx="50%" cy="50%" outerRadius={100}>
                      {assetPerformance.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No asset data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}