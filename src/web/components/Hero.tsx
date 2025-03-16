import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Render Observer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Illuminate your DOM mutations with style! Debug render issues visually and catch unnecessary re-renders in real-time.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="https://github.com/maheshbansod/render-observer-ext"
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Install Extension
            </a>
            <a 
              href="#demo" 
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              Try Demo
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 