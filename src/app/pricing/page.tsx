import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with trade journaling",
      features: [
        "Up to 200 trades",
        "Basic analytics dashboard",
        "Manual trade entry",
        "Equity curve visualization",
        "Performance metrics",
        "Mobile responsive",
      ],
      cta: "Get Started Free",
      ctaLink: "/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "Everything you need to become a better trader",
      features: [
        "Unlimited trades",
        "AI-powered insights",
        "Weekly AI reports",
        "Monthly AI reports",
        "Advanced analytics",
        "Strategy performance analysis",
        "Export to PDF/CSV/Excel",
        "Goal tracking & achievements",
        "Priority email support",
        "Early access to new features",
      ],
      cta: "Upgrade to Pro",
      ctaLink: "/signup",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">TradeReportz</h1>
          </Link>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">
                  {plan.name}
                </CardTitle>

                <div className="mb-2">
                  <span className="text-5xl font-bold">
                    {plan.price}
                  </span>

                  <span className="text-muted-foreground ml-2">
                    /{plan.period}
                  </span>
                </div>

                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <Check
                        className="text-primary flex-shrink-0 mt-0.5"
                        size={20}
                      />
                      <span className="text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaLink}>
                  <Button
                    className="w-full"
                    variant={
                      plan.highlighted
                        ? "default"
                        : "outline"
                    }
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

              </CardContent>
            </Card>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          © 2026 TradeReportz. All rights reserved.
        </div>
      </footer>

    </div>
  );
}