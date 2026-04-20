import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('apixel_theme');
    return stored ? stored === 'dark' : true;
  });

  const applyTheme = useCallback((dark) => {
    // Check if currently on admin pages
    const isAdmin = window.location.pathname.startsWith('/admin');
    if (isAdmin) {
      // Force dark on admin pages - admin has its own toggle
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      if (dark) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('apixel_theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
