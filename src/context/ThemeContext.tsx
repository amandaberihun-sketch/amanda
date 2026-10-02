import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isOled: boolean;
  toggleOled: () => void;
  setOled: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Temporary low-light mode (defaults to false, or remembers session)
  const [isOled, setIsOled] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kred_oled_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('kred_oled_mode', isOled ? 'true' : 'false');
    } catch {}

    const root = document.documentElement;
    root.setAttribute('data-oled', isOled ? 'true' : 'false');

    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isOled ? '#000000' : '#181818');
    }
  }, [isOled]);

  const toggleOled = () => setIsOled((prev) => !prev);
  const setOled = (val: boolean) => setIsOled(val);

  return (
    <ThemeContext.Provider value={{ isOled, toggleOled, setOled }}>
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
