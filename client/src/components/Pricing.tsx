import { motion } from "motion/react";
import { Check, Star } from "lucide-react";

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "3 presentations per month",
      "Basic templates",
      "PDF export",
      "Standard processing speed",
      "Email support",
    ],
    color: "from-primary-500 to-accent-500",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Best for researchers and students",
    features: [
      "50 presentations per month",
      "Premium templates",
      "PowerPoint, PDF & Google Slides",
      "Fast processing speed",
      "Priority email support",
      "Custom branding",
      "Advanced AI insights",
    ],
    color: "from-accent-500 to-secondary-500",
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
    color: "from-secondary-500 to-primary-500",
    popular: false,
  },
];

export function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-white/10 backdrop-blur-md border-accent-400 shadow-2xl shadow-accent-500/20 scale-105"
                  : "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-sm font-semibold text-white">Most Popular</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">/{plan.period}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                  plan.popular
                    ? "bg-gradient-to-r from-accent-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-accent-500/50 hover:scale-105"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                {plan.name === "Free" ? "Start Free" : "Get Started"}
              </button>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
