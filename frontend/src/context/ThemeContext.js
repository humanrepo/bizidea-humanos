import React, { createContext, useContext, useEffect, useState } from 'react';

// Créer le contexte
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Fournisseur de thème
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Vérifier la préférence du système
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Changer le thème et le sauvegarder dans localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
