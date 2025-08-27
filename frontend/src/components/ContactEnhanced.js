import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

const ContactEnhanced = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestType, setRequestType] = useState('');

  const formValues = watch();

  const onSubmit = async (data) => {
    try {
      // Simuler l'envoi du formulaire (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Données du formulaire:', data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const requestTypes = [
    { value: 'general', label: 'Demande générale' },
    { value: 'support', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'feedback', label: 'Retour d\'expérience' },
    { value: 'other', label: 'Autre' }
  ];

  const FloatingLabelInput = ({ id, label, type = 'text', icon: Icon, error, ...props }) => {
    const hasValue = formValues?.[id];
    
    return (
      <div className="relative mb-6">
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id={id}
            type={type}
            className={`
              w-full pt-5 pb-2 pl-10 pr-4 border-2 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              peer
            `}
            {...props}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-10 top-1/2 transform -translate-y-1/2
              text-gray-500 dark:text-gray-400
              transition-all duration-200
              pointer-events-none
              peer-focus:text-blue-600 peer-focus:dark:text-blue-400
              peer-focus:scale-90 peer-focus:-translate-y-7
              ${hasValue ? 'scale-90 -translate-y-7 text-blue-600 dark:text-blue-400' : ''}
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  const FloatingLabelTextarea = ({ id, label, icon: Icon, error, ...props }) => {
    const hasValue = formValues?.[id];
    
    return (
      <div className="relative mb-6">
        <div className="relative">
          <Icon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <textarea
            id={id}
            className={`
              w-full pt-5 pb-2 pl-10 pr-4 border-2 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              resize-none
              ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              peer
            `}
            rows="4"
            {...props}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-10 top-4
              text-gray-500 dark:text-gray-400
              transition-all duration-200
              pointer-events-none
              peer-focus:text-blue-600 peer-focus:dark:text-blue-400
              peer-focus:scale-90 peer-focus:-translate-y-5
              ${hasValue ? 'scale-90 -translate-y-5 text-blue-600 dark:text-blue-400' : ''}
              ${error ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {error.message}
          </motion.p>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Contactez-nous
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Nous serions ravis de vous entendre ! Remplissez le formulaire ci-dessous.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg mx-auto bg-green-50 dark:bg-green-900/20 p-8 rounded-lg text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-2">
                Message envoyé !
              </h3>
              <p className="text-green-600 dark:text-green-300 mb-6">
                Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Envoyer un nouveau message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <FloatingLabelInput
                id="name"
                label="Votre nom complet"
                icon={User}
                error={errors.name}
                {...register('name', { 
                  required: 'Le nom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères'
                  }
                })}
              />

              <FloatingLabelInput
                id="email"
                type="email"
                label="Votre adresse email"
                icon={Mail}
                error={errors.email}
                {...register('email', { 
                  required: 'L\'email est requis', 
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Adresse email invalide'
                  }
                })}
              />

              <div className="relative mb-6">
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    {...register('requestType', { required: 'Veuillez sélectionner un type de demande' })}
                    className={`
                      w-full p-3 pr-10 border-2 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      appearance-none
                      ${errors.requestType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                    `}
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="">Type de demande</option>
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.requestType && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.requestType.message}
                  </motion.p>
                )}
              </div>

              <FloatingLabelTextarea
                id="message"
                label="Votre message"
                icon={MessageSquare}
                error={errors.message}
                {...register('message', { 
                  required: 'Le message est requis',
                  minLength: {
                    value: 10,
                    message: 'Le message doit contenir au moins 10 caractères'
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Le message ne peut pas dépasser 1000 caractères'
                  }
                })}
              />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 
                  text-white font-semibold rounded-lg 
                  transition-all duration-200 flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactEnhanced;
