import { siteName, siteUrl, twitterHandle } from "@/lib/seo";

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  url: string;
}

const homeFeatureHighlights = [
  "AI-powered trading insights for bias and performance",
  "trade journaling with entry/exit details and emotional notes",
  "future paper trading readiness for strategy practice",
  "advanced analytics like win rate, equity curve, and profit factor",
];

const pricingFocus = [
  "free and Pro plans for trading journals",
  "AI reports and analytics for serious traders",
  "paper trading readiness built into future releases",
];

export function buildHomePageSeoMetadata(): SeoMetadata {
  return {
    title: `${siteName} — AI Trading Journal, Analytics & Paper Trading`,
    description: `TradeReportz helps traders log trades, review performance, and generate AI-powered insights with a trading journal built for both live and future paper trading workflows.`,
    keywords: [
      "trading journal",
      "AI trading insights",
      "trade analytics",
      "paper trading app",
      "trade performance",
      ...homeFeatureHighlights.map((item) => item.split(" ").slice(0, 3).join(" ")),
    ],
    url: `${siteUrl}/`,
  };
}

export function buildPricingPageSeoMetadata(): SeoMetadata {
  return {
    title: `Pricing | ${siteName}`,
    description: `Compare TradeReportz plans for trade journaling, advanced analytics, AI-powered reports, and future paper trading support. Start free and scale as your trading goals grow.`,
    keywords: [
      "trade journal pricing",
      "AI trading reports",
      "paper trading pricing",
      "trade analytics subscription",
      ...pricingFocus,
    ],
    url: `${siteUrl}/pricing`,
  };
}

export function buildAuthPageSeoMetadata(page: "login" | "signup") {
  if (page === "login") {
    return {
      title: `Login | ${siteName}`,
      description: `Sign in to TradeReportz to access your trading journal, performance dashboard, and AI analysis reports.`,
      keywords: ["trade journal login", "trading journal sign in", "AI trading analytics"],
      url: `${siteUrl}/login`,
    };
  }

  return {
    title: `Sign Up | ${siteName}`,
    description: `Create a TradeReportz account to start tracking trades, reviewing performance, and unlocking AI-powered trading insights.`,
    keywords: ["trade journal signup", "new trading account", "paper trading journal"],
    url: `${siteUrl}/signup`,
  };
}

export function getOpenGraphImageUrl(path: string) {
  return `${siteUrl}${path}`;
}
