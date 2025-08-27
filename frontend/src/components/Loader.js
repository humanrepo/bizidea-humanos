import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <motion.div
        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-white text-xl font-bold">B</span>
      </motion.div>
    </div>
  );
};

export default Loader;
