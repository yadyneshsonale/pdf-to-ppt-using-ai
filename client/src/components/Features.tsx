import { motion } from "motion/react";
import { Zap, Brain, Download, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI understands your research paper and extracts key insights automatically.",
    color: "from-primary-500 to-accent-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional presentations in seconds, not hours. Save valuable time.",
    color: "from-accent-500 to-secondary-500",
  },
  {
    icon: Sparkles,
    title: "Beautiful Design",
    description: "Automatically styled slides with modern, professional templates that impress.",
    color: "from-secondary-500 to-primary-500",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download as PowerPoint, PDF, or Google Slides. Compatible with all platforms.",
    color: "from-primary-400 to-accent-400",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your research stays confidential. We never share or store your sensitive data.",
    color: "from-accent-400 to-secondary-400",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your presentations anytime, anywhere. Cloud-based and always ready.",
    color: "from-secondary-400 to-primary-400",
  },
];

export function Features() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Powerful features designed to make your research presentations effortless
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
