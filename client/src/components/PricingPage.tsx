import { motion } from "motion/react";
import { Check, Star, ArrowLeft, Zap, Shield, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: string) => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "5 presentations per month",
      "Basic templates",
      "PDF export only",
      "Standard processing speed",
      "Community support",
    ],
    limitations: [
      "No premium templates",
      "No priority processing",
    ],
    color: "from-slate-500 to-slate-600",
    buttonText: "Current Plan",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Best for researchers and students",
    features: [
      "50 presentations per month",
      "All premium templates",
      "PowerPoint, PDF & Google Slides",
      "Fast processing speed",
      "Priority email support",
      "Custom branding",
      "Advanced AI insights",
    ],
    limitations: [],
    color: "from-primary-500 to-accent-500",
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and institutions",
    features: [
      "Unlimited presentations",
      "All premium templates",
      "All export formats",
      "Lightning fast processing",
      "24/7 priority support",
      "Custom branding & templates",
      "Advanced AI insights",
      "Team collaboration",
      "API access",
      "Dedicated account manager",
    ],
    limitations: [],
    color: "from-accent-500 to-secondary-500",
    buttonText: "Contact Sales",
    popular: false,
  },
];

export function PricingPage({ onBack, onSelectPlan }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
            No hidden fees.
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
              <p className="text-sm text-slate-400">
                Advanced AI extracts key insights from your papers
              </p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Save Hours</h3>
              <p className="text-sm text-slate-400">
                Convert papers to presentations in minutes
              </p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Secure</h3>
              <p className="text-sm text-slate-400">
                Your documents are encrypted and private
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-white/10 backdrop-blur-md border-primary-500 shadow-2xl shadow-primary-500/20 scale-105"
                  : "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-sm font-semibold text-white">Most Popular</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 ml-2">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-3 opacity-50">
                    <span className="w-5 h-5 flex items-center justify-center text-slate-500">✕</span>
                    <span className="text-slate-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-6 text-lg font-semibold ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 mb-12">
            Have questions? We've got answers.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
              },
              {
                q: "Is there a free trial?",
                a: "Our Free plan gives you 5 presentations per month to try out the service. No credit card required.",
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "Yes, you can change your plan at any time. Changes take effect on your next billing cycle.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
