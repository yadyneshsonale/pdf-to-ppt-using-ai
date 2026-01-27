import { motion } from "motion/react";
import { Upload, Brain, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Paper",
    description: "Simply drag and drop your research paper in PDF, DOC, or DOCX format.",
    color: "from-primary-500 to-accent-500",
  },
  {
    icon: Brain,
    title: "AI Processing",
    description: "Our advanced AI analyzes your paper, extracts key points, and structures the content.",
    color: "from-accent-500 to-secondary-500",
  },
  {
    icon: Download,
    title: "Download & Present",
    description: "Get your professionally designed presentation ready to present in seconds.",
    color: "from-secondary-500 to-primary-500",
  },
];

export function HowItWorks() {
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
            How It Works
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Three simple steps to transform your research into a stunning presentation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 -right-4 z-20">
                  <ArrowRight className="w-8 h-8 text-accent-400" />
                </div>
              )}

              <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 text-center">
                <div className="inline-flex mb-6">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${step.color}`}>
                    <step.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-accent-400 font-bold mb-4">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
