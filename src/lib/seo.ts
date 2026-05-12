export const siteUrl = "https://tradereportz.in";
export const siteName = "TradeReportz";
export const siteDescription =
  "TradeReportz is an AI-powered trading journal and analytics platform for traders who want better performance tracking, discipline, and future paper trading readiness.";
export const twitterHandle = "@TradeReportz";
export const siteKeywords = [
  "trading journal",
  "trade analytics",
  "AI trading insights",
  "paper trading",
  "trade performance tracking",
  "trade logging",
];

export const homepageSeo = {
  title: "TradeReportz — AI Trading Journal, Analytics & Paper Trading",
  description:
    "Log trades, analyze performance, and get AI-powered insights with TradeReportz. Built for active traders, stock market traders, crypto traders, and future paper trading workflows.",
  keywords: [
    "trading journal",
    "AI trading journal",
    "paper trading app",
    "trade analytics",
    "trade log",
  ],
  url: `${siteUrl}/`,
};

export const pricingSeo = {
  title: "Pricing | TradeReportz",
  description:
    "Choose the right TradeReportz plan for trade journaling, advanced analytics, and AI reports. Start free and upgrade when you're ready to add paper trading and deeper performance tracking.",
  keywords: [
    "trading journal pricing",
    "paper trading pricing",
    "trade analytics subscription",
    "AI trading reports",
  ],
  url: `${siteUrl}/pricing`,
};

export const authSeo = {
  login: {
    title: "Login | TradeReportz",
    description:
      "Sign in to TradeReportz to access your trading journal, performance dashboard, and AI trade insights.",
    url: `${siteUrl}/login`,
  },
  signup: {
    title: "Sign Up | TradeReportz",
    description:
      "Create a TradeReportz account to start logging trades, tracking performance, and unlocking AI-powered trading insights.",
    url: `${siteUrl}/signup`,
  },
};

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: `${siteUrl}/pricing`,
    },
  };
}

export function getPricingFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use TradeReportz for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. TradeReportz offers a free plan for traders who want to start logging trades and tracking basic performance metrics.",
        },
      },
      {
        "@type": "Question",
        name: "Does TradeReportz support AI-powered trade insights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. TradeReportz includes AI-powered insights and weekly reports to help you identify patterns, emotional bias, and improvement opportunities.",
        },
      },
      {
        "@type": "Question",
        name: "Is paper trading supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paper trading is coming soon as part of TradeReportz, so you can practice strategies without risking real capital.",
        },
      },
    ],
  };
}
