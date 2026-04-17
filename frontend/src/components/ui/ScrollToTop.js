import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { isDark, applyTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Re-apply theme correctly based on admin vs public page
    applyTheme(isDark);
  }, [pathname, isDark, applyTheme]);

  return null;
};

export default ScrollToTop;
