import Link from "next/link";

export const metadata = {
  title: "Terms of Service | TradeReportz",
  description:
    "Review the TradeReportz terms of service for using our trading journal and analytics platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Back to home
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>

        <p className="mt-4 text-white/60 leading-relaxed text-lg">
          These Terms of Service govern your use of the TradeReportz platform. By accessing and using TradeReportz, you agree to these terms.
        </p>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Use of Service</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              TradeReportz provides a trading journal and analytics platform for traders. You agree to use the service responsibly and not to submit prohibited or illegal content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Accounts</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              You are responsible for safeguarding your login credentials and maintaining the security of your account. Use of your account implies consent to the data practices described in our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Payments</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              Paid plans are billed according to the terms presented at signup. Subscriptions can be canceled as described in your account settings or the plan terms at the time of purchase.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Limitation of Liability</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              TradeReportz provides information and analytics for educational purposes. We do not guarantee trading results, and users are responsible for their own investment decisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Changes to Terms</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              We may update these terms from time to time. Continued use of the site after changes indicates your acceptance of the new terms.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
