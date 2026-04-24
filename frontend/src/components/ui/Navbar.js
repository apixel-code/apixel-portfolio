import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Store', path: '/templates' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Apixel Home">
            <img 
              src={isDark ? "/assets/f-light.png" : "/assets/f-dark.png"}
              alt="Apixel Logo" 
              className={`h-12 sm:h-14 md:h-16 w-auto object-contain ${isDark ? 'mix-blend-screen' : ''}`}
              style={isDark ? { filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.28))' } : {}}
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-dm-sans text-sm font-medium transition-colors relative ${
                  isActive(link.path) ? 'text-brand-cyan' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-cyan"
                  />
                )}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              data-testid="theme-toggle-btn"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-brand-gold" /> : <Moon size={16} className="text-brand-purple" />}
            </button>
            <Link
              to="/contact"
              className="btn-primary text-sm py-2 px-6"
              data-testid="nav-get-started-btn"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              data-testid="theme-toggle-mobile-btn"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-brand-gold" /> : <Moon size={16} className="text-brand-purple" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white"
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block font-dm-sans text-lg font-medium py-2 ${
                    isActive(link.path) ? 'text-brand-cyan' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary block text-center mt-4"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
