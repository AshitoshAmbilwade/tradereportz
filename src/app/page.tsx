"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  Brain,
  Target,
  Award,
  FileText,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Menu,
  X,
  BookOpen,
  LineChart,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────

const equityData = [
  { day: "Jan", value: 10000 },
  { day: "Feb", value: 9400 },
  { day: "Mar", value: 11800 },
  { day: "Apr", value: 11100 },
  { day: "May", value: 13600 },
  { day: "Jun", value: 12900 },
  { day: "Jul", value: 16200 },
  { day: "Aug", value: 15400 },
  { day: "Sep", value: 18100 },
  { day: "Oct", value: 17200 },
  { day: "Nov", value: 20600 },
  { day: "Dec", value: 24400 },
];

const features = [
  {
    icon: BookOpen,
    title: "Trade Journaling",
    description:
      "Log every trade with entry/exit prices, screenshots, emotions, and detailed notes. Build a searchable trading history.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    borderHover: "hover:border-blue-500/20",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Deep performance metrics: win rate, profit factor, Sharpe ratio, average R and interactive equity curves.",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    borderHover: "hover:border-violet-500/20",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "AI analysis reveals hidden patterns, emotional biases, and personalized recommendations to sharpen your edge.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    borderHover: "hover:border-emerald-500/20",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Set monthly profit targets and max drawdown rules. Get alerts the moment you drift from your trading plan.",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-400/10",
    borderHover: "hover:border-orange-500/20",
  },
  {
    icon: Award,
    title: "Achievements",
    description:
      "Unlock milestones as you grow. Track streaks, personal records, and discipline scores to stay motivated.",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-400/10",
    borderHover: "hover:border-pink-500/20",
  },
  {
    icon: FileText,
    title: "Weekly AI Reports",
    description:
      "Auto-generated reports every Sunday summarising your week, top mistakes, and priorities for the week ahead.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-400/10",
    borderHover: "hover:border-cyan-500/20",
  },
];

const stats = [
  { value: "10K+", label: "Active Traders", icon: TrendingUp },
  { value: "1M+", label: "Trades Analysed", icon: BarChart3 },
  { value: "95%", label: "Satisfaction Rate", icon: Star },
  { value: "$2M+", label: "Profits Tracked", icon: LineChart },
];

const steps = [
  {
    step: "01",
    title: "Log Your Trades",
    description:
      "Add trades manually or import from your broker. Capture every detail — symbols, size, entry, exit, and personal notes.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Review Your Analytics",
    description:
      "Instantly visualise performance with equity curves, win-rate heatmaps, and session-by-session breakdowns.",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Get AI Insights",
    description:
      "Receive personalised AI feedback that identifies patterns, flags bias, and tells you exactly how to improve.",
    icon: Brain,
  },
];

const testimonials = [
  {
    name: "Marcus R.",
    role: "Day Trader · 6 years",
    initials: "MR",
    rating: 5,
    text: "TradeReportz completely changed how I reflect on trades. I discovered I was giving back 40% of profits on Fridays — something I'd never noticed until I saw the analytics laid out.",
  },
  {
    name: "Priya S.",
    role: "Swing Trader · 4 years",
    initials: "PS",
    rating: 5,
    text: "The AI insights are genuinely useful. It noticed I consistently revenge-traded after two consecutive losses and suggested session rules that cut my monthly drawdown in half.",
  },
  {
    name: "Daniel K.",
    role: "Futures Trader · 8 years",
    initials: "DK",
    rating: 5,
    text: "Best trading journal I've used — and I've tried them all. The weekly reports save me hours of self-review and keep me accountable to my plan every single week.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For traders just getting started",
    features: [
      "Up to 50 trades / month",
      "Basic analytics dashboard",
      "Equity curve",
      "CSV export",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious active traders",
    features: [
      "Unlimited trades",
      "Advanced analytics suite",
      "AI-powered insights",
      "Weekly AI reports",
      "Goal & rule tracking",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Elite",
    price: "$49",
    period: "/ month",
    description: "For professionals and funds",
    features: [
      "Everything in Pro",
      "Multi-account tracking",
      "API access",
      "Custom AI report templates",
      "Team collaboration",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/signup",
    popular: false,
  },
];

// ── Animation variants ─────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

// ── Page ───────────────────────────────────────────────────────────

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090f] text-white overflow-x-hidden selection:bg-emerald-500/30">

      {/* ════════════ NAV ════════════ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#07090f]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <TrendingUp size={15} className="text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
              TradeReportz
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/[0.06] h-9"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold h-9 px-5 shadow-lg shadow-emerald-500/25 transition-all"
              >
                Start Free
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0d101c] border-b border-white/[0.06] px-6 py-5 flex flex-col gap-4"
          >
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-white/60 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full border-white/10 text-white/70 hover:bg-white/5">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400">
                  Start Free
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ════════════ HERO ════════════ */}
      <section className="relative pt-36 pb-16 px-6 max-w-7xl mx-auto">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute top-48 left-1/4 w-[400px] h-[300px] bg-violet-500/[0.05] rounded-full blur-[100px]" />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8"
          >
            <Zap size={12} className="text-emerald-400" />
            <span className="text-[13px] text-emerald-400 font-medium tracking-wide">
              AI-Powered Trading Analytics
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-[72px] font-bold leading-[1.08] tracking-[-0.02em] mb-6"
          >
            <span className="text-white">The Journal That</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Makes You a Better Trader
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track every trade, uncover hidden patterns, and receive AI-powered
            coaching — all in one professional dashboard built for serious traders.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 h-12 text-[15px] shadow-2xl shadow-emerald-500/20 transition-all hover:shadow-emerald-400/30 hover:scale-[1.02]"
              >
                Start Free — No Card Required
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white/65 hover:text-white hover:bg-white/[0.04] h-12 text-[15px]"
              >
                View Live Demo
                <ChevronRight size={16} className="ml-1 opacity-60" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-[12px] text-white/25 mt-4 flex items-center justify-center gap-1"
          >
            <Shield size={11} />
            14-day free trial &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Cancel anytime
          </motion.p>
        </div>

        {/* ── Dashboard Preview ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
          className="relative mt-14 max-w-5xl mx-auto"
        >
          {/* Glow ring */}
          <div className="absolute -inset-px bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent rounded-2xl blur-md pointer-events-none" />

          <div className="relative bg-[#0d101c] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            {/* Browser chrome */}
            <div className="bg-[#111520] border-b border-white/[0.05] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#1a2235] rounded-md px-3 py-1 text-[11px] text-white/25 w-60 text-center">
                  app.tradereportz.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-5 grid grid-cols-12 gap-4">
              {/* Sidebar */}
              <div className="hidden lg:flex col-span-2 flex-col gap-1.5 pt-1">
                {["Dashboard", "Trades", "Analytics", "Reports", "Settings"].map(
                  (label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium cursor-default ${
                        i === 0
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-white/25 hover:text-white/50"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          i === 0 ? "bg-emerald-400" : "bg-white/15"
                        }`}
                      />
                      {label}
                    </div>
                  )
                )}
              </div>

              {/* Main */}
              <div className="col-span-12 lg:col-span-10 space-y-4">
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total P&L", value: "+$12,480", badge: "+24.8%", green: true },
                    { label: "Win Rate", value: "67.3%", badge: "+3.2%", green: true },
                    { label: "Profit Factor", value: "2.14", badge: "+0.18", green: true },
                    { label: "Max Drawdown", value: "-4.2%", badge: "-1.1%", green: false },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-[#111827] border border-white/[0.05] rounded-xl p-3"
                    >
                      <div className="text-[11px] text-white/35 mb-1">{s.label}</div>
                      <div
                        className={`text-[18px] font-bold ${
                          s.green ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {s.value}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          s.green ? "text-emerald-400/60" : "text-red-400/60"
                        }`}
                      >
                        {s.badge}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Equity chart */}
                <div className="bg-[#111827] border border-white/[0.05] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-white/75">
                      Equity Curve
                    </span>
                    <span className="text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-2.5 py-0.5 rounded-full">
                      +144.0% YTD
                    </span>
                  </div>
                  <div className="h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={equityData}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <Tooltip
                          contentStyle={{
                            background: "#1a2235",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 8,
                            color: "#fff",
                            fontSize: 12,
                          }}
                          formatter={(value: number | string) => [
                            `$${Number(value).toLocaleString()}`,
                            "Portfolio",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#grad)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent trades */}
                <div className="bg-[#111827] border border-white/[0.05] rounded-xl p-4">
                  <div className="text-[13px] font-semibold text-white/75 mb-3">
                    Recent Trades
                  </div>
                  <div className="space-y-0">
                    {[
                      { sym: "AAPL", side: "LONG", entry: "182.40", exit: "187.20", pnl: "+$480", win: true },
                      { sym: "TSLA", side: "SHORT", entry: "248.60", exit: "241.30", pnl: "+$730", win: true },
                      { sym: "NQ", side: "LONG", entry: "19240", exit: "19190", pnl: "−$250", win: false },
                    ].map((t) => (
                      <div
                        key={t.sym}
                        className="flex items-center justify-between text-[12px] py-2 border-b border-white/[0.04] last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              t.side === "LONG"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {t.side}
                          </span>
                          <span className="text-white/75 font-semibold">{t.sym}</span>
                        </div>
                        <span className="text-white/25">
                          {t.entry} → {t.exit}
                        </span>
                        <span
                          className={`font-semibold ${
                            t.win ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {t.pnl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════ STATS BAR ════════════ */}
      <section className="border-y border-white/[0.05] py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <Icon size={18} className="text-emerald-400 mx-auto mb-3" />
                <div className="text-[32px] font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[13px] text-white/35 mt-1">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-violet-500/[0.08] border border-violet-500/20 rounded-full px-4 py-1.5 mb-5"
          >
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[13px] text-violet-400 font-medium">
              Everything You Need
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Built for Serious Traders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed"
          >
            Every feature is designed to help you understand your trading behaviour,
            eliminate your weaknesses, and scale what works.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`group bg-[#0d101c] border border-white/[0.06] rounded-2xl p-6 ${f.borderHover} hover:bg-[#0f1220] transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className={`w-11 h-11 ${f.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={f.iconColor} strokeWidth={1.8} />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-[14px] text-white/40 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how-it-works" className="py-28 px-6 bg-[#0a0c14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-cyan-500/[0.08] border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5"
            >
              <Zap size={12} className="text-cyan-400" />
              <span className="text-[13px] text-cyan-400 font-medium">
                Simple Process
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Up and Running in Minutes
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                  <div className="w-14 h-14 bg-[#0d101c] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-emerald-400" strokeWidth={1.6} />
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400/60 tracking-widest mb-2">
                    STEP {s.step}
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-white/40 leading-relaxed max-w-xs mx-auto">
                    {s.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Traders Love TradeReportz
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            Join thousands of traders who are already improving their performance.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#0d101c] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-[14px] text-white/55 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white/80">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-white/35">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════ PRICING ════════════ */}
      <section id="pricing" className="py-28 px-6 bg-[#0a0c14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-4 py-1.5 mb-5"
            >
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span className="text-[13px] text-emerald-400 font-medium">
                Simple Pricing
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Invest in Your Edge
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`relative rounded-2xl p-6 flex flex-col gap-5 ${
                  plan.popular
                    ? "bg-gradient-to-b from-emerald-500/[0.12] to-transparent border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
                    : "bg-[#0d101c] border border-white/[0.06]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="text-[14px] font-semibold text-white/70 mb-1">
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-[40px] font-bold text-white leading-none">
                      {plan.price}
                    </span>
                    <span className="text-[13px] text-white/35 mb-1.5">
                      {plan.period}
                    </span>
                  </div>
                  <div className="text-[13px] text-white/35 mt-1">
                    {plan.description}
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-[13px] text-white/60">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full font-semibold ${
                      plan.popular
                        ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-white/[0.06] hover:bg-white/10 text-white/80 border border-white/[0.08]"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="py-28 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#0d1a14] to-[#0d101c] border border-emerald-500/20 rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-transparent pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/[0.06] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-[13px] text-emerald-400 font-medium">
                Start Today
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to Trade Smarter?
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 10,000+ traders using TradeReportz to identify their edge,
              fix their mistakes, and grow their accounts consistently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 h-12 text-[15px] shadow-2xl shadow-emerald-500/25 hover:scale-[1.02] transition-all"
                >
                  Get Started Free
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white/65 hover:text-white hover:bg-white/[0.04] h-12 text-[15px]"
                >
                  Log in to Your Account
                </Button>
              </Link>
            </div>
            <p className="text-[12px] text-white/25 mt-5 flex items-center justify-center gap-1">
              <Shield size={11} />
              Free 14-day trial &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Cancel anytime
            </p>
          </div>
        </motion.div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="border-t border-white/[0.05] bg-[#07090f]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <TrendingUp size={13} className="text-white" />
              </div>
              <span className="text-[16px] font-bold text-white/80">
                TradeReportz
              </span>
            </div>
            <p className="text-[13px] text-white/35 leading-relaxed max-w-xs">
              The professional trading journal that turns your trade data into
              actionable insights and measurable improvement.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-[12px] font-semibold text-white/30 tracking-widest mb-4">
              PRODUCT
            </div>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "Changelog", "Roadmap"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-[12px] font-semibold text-white/30 tracking-widest mb-4">
              COMPANY
            </div>
            <ul className="space-y-2.5">
              {["About", "Blog", "Privacy Policy", "Terms of Service"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-white/25">
              © 2026 TradeReportz. All rights reserved.
            </p>
            <p className="text-[12px] text-white/20">
              Made for traders, by traders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
