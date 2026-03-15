"use client";

import { useState } from "react";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

import { Brain, FileText, Loader2, Lock } from "lucide-react";

import { calculateAnalytics, getPerformanceByStrategy } from "@/lib/analytics";

export default function Reports() {
  const { trades } = useTrades();
  const { user } = useAuth();

  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const isPro = user?.subscriptionPlan === "pro";

  const analytics = calculateAnalytics(trades);
  const strategyPerformance = getPerformanceByStrategy(trades);

  const generateAIReport = async () => {
    if (!isPro) {
      alert("AI Reports are only available on the Pro plan.");
      return;
    }

    if (trades.length < 10) {
      alert("You need at least 10 trades to generate an AI report.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const mockReport = `
# Weekly Trading Analysis Report

Total Trades: ${analytics.totalTrades}
Win Rate: ${analytics.winRate.toFixed(1)}%
Profit Factor: ${
        analytics.profitFactor === Infinity
          ? "∞"
          : analytics.profitFactor.toFixed(2)
      }

Strategy Performance:
${strategyPerformance
  .map(
    (s) =>
      `- ${s.strategy}: ${s.winRate}% win rate, $${s.totalPnL.toFixed(2)}`
  )
  .join("\n")}
`;

      setReport(mockReport);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h2 className="text-3xl font-bold mb-2">AI Reports</h2>
          <p className="text-muted-foreground">
            AI powered insights about your trading.
          </p>
        </div>

        {!isPro && (
          <Card className="border-primary">
            <CardContent className="p-6 flex gap-4">

              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="text-primary" size={24} />
              </div>

              <div>
                <h3 className="font-bold mb-2">
                  Upgrade to Pro for AI Reports
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  Unlock weekly and monthly AI trading analysis.
                </p>

                <Button>Upgrade to Pro</Button>
              </div>

            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>Weekly Report</CardTitle>
              <CardDescription>
                AI generated weekly trading insights
              </CardDescription>
            </CardHeader>

            <CardContent>

              <Button
                onClick={generateAIReport}
                disabled={!isPro || isGenerating || trades.length < 10}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2" size={18} />
                    Generate Weekly Report
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
              <CardDescription>
                Deep trading analysis and psychology patterns
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button disabled={!isPro} variant="outline" className="w-full">
                <Brain className="mr-2" size={18} />
                Generate Monthly Report
              </Button>
            </CardContent>

          </Card>

        </div>

        {report && (
          <Card>
            <CardHeader>
              <CardTitle>Your AI Report</CardTitle>
            </CardHeader>

            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">
                {report}
              </pre>

              <div className="flex gap-3 mt-6">
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline">Export CSV</Button>
              </div>
            </CardContent>

          </Card>
        )}

      </div>
    </Layout>
  );
}