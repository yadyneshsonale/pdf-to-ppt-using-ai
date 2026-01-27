import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Research Scientist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 5,
    text: "This tool saved me countless hours! The presentations it generates are professional and capture all the key points from my research papers perfectly.",
  },
  {
    name: "Prof. James Rodriguez",
    role: "University Professor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 5,
    text: "As someone who presents research regularly, this is a game-changer. The AI understands complex academic content and structures it beautifully.",
  },
  {
    name: "Emily Watson",
    role: "PhD Candidate",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5,
    text: "The free plan was perfect to get started. Now I'm a Pro subscriber and can't imagine preparing conference presentations any other way!",
  },
];

export function Testimonials() {
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
            Loved by Researchers
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of researchers who trust us with their presentations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
