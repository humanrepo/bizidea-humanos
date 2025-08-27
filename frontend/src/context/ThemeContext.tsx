import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Définir le type pour le contexte
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Créer le contexte avec un type par défaut
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};

// Props pour le fournisseur de thème
interface ThemeProviderProps {
  children: ReactNode;
}

// Fournisseur de thème
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

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

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
