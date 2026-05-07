import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const getServiceSlug = (service) =>
  service.slug || service.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const servicesDropdownRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Store', path: '/store' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isServicesActive = location.pathname === '/services';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setServices(response.data);
        }
      } catch (error) {
        console.error('Error fetching navbar services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

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
            {navLinks.slice(0, 2).map((link) => (
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
            <div className="relative" ref={servicesDropdownRef}>
              <button
                type="button"
                onClick={() => setIsServicesOpen((prev) => !prev)}
                className={`font-dm-sans text-sm font-medium transition-colors relative inline-flex items-center gap-1.5 ${
                  isServicesActive ? 'text-brand-cyan' : 'text-slate-300 hover:text-white'
                }`}
                aria-expanded={isServicesOpen}
                aria-haspopup="menu"
                data-testid="services-dropdown-toggle"
              >
                Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                />
                {isServicesActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-cyan"
                  />
                )}
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full mt-5 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-brand-dark/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"
                    role="menu"
                    data-testid="services-dropdown-menu"
                  >
                    <Link
                      to="/services"
                      onClick={() => setIsServicesOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                      role="menuitem"
                    >
                      All Services
                    </Link>
                    <div className="my-2 h-px bg-white/10" />
                    {services.length > 0 ? (
                      services.map((service) => (
                        <Link
                          key={service.id || service.name}
                          to={`/services/${getServiceSlug(service)}`}
                          onClick={() => setIsServicesOpen(false)}
                          className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-brand-cyan transition-colors"
                          role="menuitem"
                        >
                          {service.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-slate-500">
                        Services loading...
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.slice(2).map((link) => (
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
              {navLinks.slice(0, 2).map((link) => (
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
              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between font-dm-sans text-lg font-medium py-2 ${
                    isServicesActive ? 'text-brand-cyan' : 'text-slate-300'
                  }`}
                  aria-expanded={isMobileServicesOpen}
                  data-testid="mobile-services-dropdown-toggle"
                >
                  Services
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 space-y-1 border-l border-white/10 pl-4">
                        <Link
                          to="/services"
                          onClick={() => setIsOpen(false)}
                          className="block py-2 text-sm font-semibold text-white"
                        >
                          All Services
                        </Link>
                        {services.length > 0 ? (
                          services.map((service) => (
                            <Link
                              key={service.id || service.name}
                              to={`/services/${getServiceSlug(service)}`}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-sm text-slate-400 hover:text-brand-cyan"
                            >
                              {service.name}
                            </Link>
                          ))
                        ) : (
                          <p className="py-2 text-sm text-slate-500">
                            Services loading...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.slice(2).map((link) => (
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
