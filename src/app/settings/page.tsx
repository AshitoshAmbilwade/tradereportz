"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Layout from "@/app/components/Layout";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  User,
  CreditCard,
  Target,
  Award,
  Lock,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldCheck,
  BarChart2,
  Calendar,
  Hash,
  Percent,
  DollarSign,
  Check,
  Sparkles,
} from "lucide-react";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary ring-2 ring-primary/20">
      {initials}
    </div>
  );
}

function SectionIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
      <Icon size={17} strokeWidth={2} />
    </div>
  );
}

const ACHIEVEMENTS = [
  {
    id: 1,
    icon: TrendingUp,
    title: "First Trade",
    description: "Log your very first trade",
    unlocked: true,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  {
    id: 2,
    icon: Hash,
    title: "10 Trades",
    description: "Complete 10 total trades",
    unlocked: true,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    id: 3,
    icon: BarChart2,
    title: "100 Trades",
    description: "Complete 100 total trades",
    unlocked: false,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/20",
  },
  {
    id: 4,
    icon: DollarSign,
    title: "First Profitable Month",
    description: "Achieve a net-positive month",
    unlocked: false,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  {
    id: 5,
    icon: Calendar,
    title: "Consistency",
    description: "Trade for 30 consecutive days",
    unlocked: false,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    ring: "ring-pink-500/20",
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: "Risk Master",
    description: "Keep risk below 2% for 50 trades",
    unlocked: false,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    ring: "ring-cyan-500/20",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i as number) * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

const PRO_FEATURES = [
  "Unlimited trade logs",
  "Advanced analytics & charts",
  "CSV / Excel export",
  "Priority support",
];

const GOAL_FIELDS = [
  {
    key: "maxTradesPerDay" as const,
    label: "Max Trades Per Day",
    icon: Hash,
    suffix: "trades",
    description: "Daily trade limit to stay disciplined",
  },
  {
    key: "maxRiskPerTrade" as const,
    label: "Max Risk Per Trade",
    icon: ShieldCheck,
    suffix: "%",
    description: "Maximum capital risked per position",
  },
  {
    key: "targetWinRate" as const,
    label: "Target Win Rate",
    icon: Percent,
    suffix: "%",
    description: "Win rate you aim to maintain",
  },
  {
    key: "monthlyProfitTarget" as const,
    label: "Monthly Profit Target",
    icon: DollarSign,
    suffix: "USD",
    description: "Monthly P&L goal to hit",
  },
];

export default function Settings() {
  const { user } = useAuth();

  const [goals, setGoals] = useState({
    maxTradesPerDay: "3",
    maxRiskPerTrade: "2",
    targetWinRate: "60",
    monthlyProfitTarget: "5000",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const stored = localStorage.getItem(`tradereportz_goals_${user.id}`);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {}
    }
  }, [user?.id]);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`tradereportz_goals_${user?.id}`, JSON.stringify(goals));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account, subscription, and trading preferences.
          </p>
        </motion.div>

        {/* PROFILE */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <SectionIcon icon={User} color="bg-primary/10 text-primary" />
                <div>
                  <CardTitle className="text-base">Profile</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Your account information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5 p-4 rounded-xl bg-muted/40 border border-border/40">
                <UserAvatar name={user?.name ?? user?.email ?? "T"} />
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Full Name
                      </label>
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="bg-background/60 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Email Address
                      </label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-background/60 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SUBSCRIPTION */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <SectionIcon icon={CreditCard} color="bg-amber-500/10 text-amber-500" />
                <div>
                  <CardTitle className="text-base">Subscription</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Your current plan and billing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user?.subscriptionPlan === "pro" ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                      <Zap size={18} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Pro Plan</p>
                      <p className="text-xs text-muted-foreground mt-0.5">All features unlocked</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Manage Billing
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <div className="p-4 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <User size={17} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Free Plan</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Basic features included</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary ring-1 ring-primary/20">
                      Current
                    </span>
                  </div>
                  <div className="p-4 border-t border-border/40">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {PRO_FEATURES.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check size={13} className="text-emerald-500 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                      <Button size="sm" className="shrink-0 gap-1.5 text-xs">
                        <Sparkles size={13} />
                        Upgrade to Pro
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* TRADING GOALS */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Target} color="bg-blue-500/10 text-blue-500" />
                  <div>
                    <CardTitle className="text-base">Trading Goals</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Set your personal performance targets</CardDescription>
                  </div>
                </div>
                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-500/20"
                    >
                      <CheckCircle2 size={12} />
                      Saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGoals} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {GOAL_FIELDS.map(({ key, label, icon: Icon, suffix, description }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Icon size={12} className="text-muted-foreground" />
                        {label}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={goals[key]}
                          onChange={(e) => setGoals({ ...goals, [key]: e.target.value })}
                          className="pr-12 text-sm"
                          min="0"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                          {suffix}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit" size="sm" className="text-xs px-5">
                    Save Goals
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* ACHIEVEMENTS */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <SectionIcon icon={Award} color="bg-violet-500/10 text-violet-500" />
                <div>
                  <CardTitle className="text-base">Achievements</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {ACHIEVEMENTS.filter((a) => a.unlocked).length} of {ACHIEVEMENTS.length} unlocked
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <motion.div
                    key={a.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className={`
                      relative flex items-start gap-3 rounded-xl border p-3.5 transition-all
                      ${a.unlocked
                        ? `border-border/60 bg-card`
                        : "border-border/30 bg-muted/20 opacity-50"
                      }
                    `}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${a.bg} ${a.ring}`}>
                      {a.unlocked
                        ? <a.icon size={16} className={a.color} />
                        : <Lock size={14} className="text-muted-foreground" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{a.description}</p>
                    </div>
                    {a.unlocked && (
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </Layout>
  );
}
