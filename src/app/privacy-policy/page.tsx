import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | TradeReportz",
  description:
    "Read TradeReportz's privacy policy and learn how we collect, use, and protect your trading journal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Back to home
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>

        <p className="mt-4 text-white/60 leading-relaxed text-lg">
          TradeReportz respects your privacy and is committed to protecting your trading journal data. This policy explains how we collect, use, and safeguard information when you use our service.
        </p>

        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              We collect the information you provide when you sign up and log trades, including email, trade details, performance metrics, notes, and preferences. We also collect analytics data to improve the product and provide better insights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">How We Use Your Data</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              Your data is used to power your trading journal, generate analytics, deliver AI insights, and maintain your account. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Data Security</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              We use industry-standard security practices to protect your data. Access to your trading records is restricted and encrypted in transit.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Cookies & Tracking</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              We may use cookies and similar technologies for authentication, analytics, and product improvements. You can manage cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Contact</h2>
            <p className="mt-3 text-white/65 leading-relaxed">
              If you have questions about this policy, please reach out via the contact details on our website.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
