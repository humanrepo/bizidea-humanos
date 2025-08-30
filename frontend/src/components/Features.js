qaimport React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { slideIn, staggerContainer } from '../utils/animations';

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: '📊',
      title: 'Tableau de bord intelligent',
      description: 'Visualisez vos performances en temps réel avec des métriques clés et des insights personnalisés.'
    },
    {
      icon: '📈',
      title: 'Analytics avancés',
      description: 'Analysez vos données avec des rapports détaillés et des prédictions basées sur l\'IA.'
    },
    {
      icon: '👥',
      title: 'Collaboration d\'équipe',
      description: 'Travaillez efficacement avec votre équipe grâce aux outils de collaboration intégrés.'
    },
    {
      icon: '🚀',
      title: 'Lancement rapide',
      description: 'Démarrez votre projet en quelques minutes avec nos templates et outils prêts à l\'emploi.'
    },
    {
      icon: '🔒',
      title: 'Sécurité renforcée',
      description: 'Protégez vos données avec notre infrastructure sécurisée et nos protocoles de chiffrement.'
    },
    {
      icon: '🌍',
      title: 'Multi-plateforme',
      description: 'Accédez à votre plateforme depuis n\'importe quel appareil, à tout moment.'
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={slideIn.fromBottom}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Fonctionnalités puissantes
          </motion.h2>
          <motion.p
            variants={slideIn.fromBottom}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Découvrez toutes les fonctionnalités conçues pour booster votre startup
          </motion.p>
        </motion.div>

        {/* Grille de fonctionnalités */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          className="text-center mt-16"
        >
          <a
            href="/features"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Voir toutes les fonctionnalités
            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
