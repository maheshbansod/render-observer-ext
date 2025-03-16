import { motion } from 'framer-motion';

const features = [
  {
    title: "Real-time Visualization",
    description: "Watch DOM mutations come to life with elegant highlights",
    icon: "🔍"
  },
  {
    title: "Smart Detection",
    description: "Track additions, removals, and attribute changes in the DOM tree",
    icon: "🧠"
  },
  {
    title: "Performance Friendly",
    description: "Intelligent filtering to avoid noise from minor updates",
    icon: "⚡"
  },
  {
    title: "Fully Customizable",
    description: "Choose colors, styles, and configure ignored selectors",
    icon: "🎨"
  }
];

export const Features = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}; 