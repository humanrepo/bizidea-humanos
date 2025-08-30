import React from 'react';
import { motion } from 'framer-motion';
import { slideIn, staggerContainer, whileHover, whileTap } from '../utils/animations';

const Hero = () => {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.h1
            variants={slideIn.fromBottom}
            className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Bizidea by HumanOS: 
            <span className="block text-blue-600 dark:text-blue-400 mt-2">
              Votre écosystème startup
            </span>
          </motion.h1>

          <motion.p
            variants={slideIn.fromBottom}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Transformez vos idées en entreprises prospères avec notre plateforme tout-en-un. 
            Outils intelligents, accompagnement expert et communauté innovante.
          </motion.p>

          <motion.div
            variants={slideIn.fromBottom}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              whileHover={whileHover}
              whileTap={whileTap}
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Démarrer gratuitement
            </motion.a>
            
            <motion.a
              whileHover={whileHover}
              whileTap={whileTap}
              href="/demo"
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
            >
              Voir la démo
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Illustration placeholder */}
        <motion.div
          variants={slideIn.fromBottom}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg h-64 sm:h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Interface moderne Bizidea</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Design innovant et intuitif</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
