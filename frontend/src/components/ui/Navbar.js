import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Code,
  LayoutGrid,
  Menu,
  Moon,
  Palette,
  Share2,
  Sparkles,
  Sun,
  Target,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const getServiceSlug = (service) =>
  service.slug || service.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const serviceIcons = {
  Code,
  Target,
  Share2,
  Palette,
};

const getServiceIcon = (service) => serviceIcons[service.icon] || Sparkles;

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
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services');

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
          <div className="hidden md:flex items-center gap-10 lg:gap-12">
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
                    className="absolute left-1/2 top-full mt-5 w-[24rem] -translate-x-1/2 rounded-2xl border border-white/10 bg-brand-dark/95 p-3 shadow-2xl shadow-black/35 backdrop-blur-xl"
                    role="menu"
                    data-testid="services-dropdown-menu"
                  >
                    {services.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1.5">
                        {services.map((service) => {
                          const ServiceIcon = getServiceIcon(service);

                          return (
                            <Link
                              key={service.id || service.name}
                              to={`/services/${getServiceSlug(service)}`}
                              onClick={() => setIsServicesOpen(false)}
                              className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-white/10"
                              role="menuitem"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-brand-cyan transition-all group-hover:border-brand-cyan/40 group-hover:bg-brand-purple/30 group-hover:text-white">
                                <ServiceIcon size={19} />
                              </span>
                              <span className="block min-w-0 flex-1 truncate text-sm font-semibold text-white transition-colors group-hover:text-brand-cyan">
                                {service.name}
                              </span>
                              <ArrowRight size={15} className="flex-shrink-0 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-brand-cyan" />
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-xl px-4 py-3 text-sm text-slate-500">
                        Services loading...
                      </p>
                    )}
                    <div className="my-3 h-px bg-white/10" />
                    <Link
                      to="/services"
                      onClick={() => setIsServicesOpen(false)}
                      className="group flex items-center gap-3 rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 px-4 py-3 transition-all hover:border-brand-cyan/40 hover:bg-brand-cyan/15"
                      role="menuitem"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-cyan text-brand-dark">
                        <LayoutGrid size={19} />
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold text-white">View All Services</span>
                      <ArrowRight size={16} className="text-brand-cyan transition-transform group-hover:translate-x-1" />
                    </Link>
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
              Hire Us
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
                      <div className="mt-3 space-y-2 border-l border-white/10 pl-4">
                        {services.length > 0 ? (
                          services.map((service) => {
                            const ServiceIcon = getServiceIcon(service);

                            return (
                              <Link
                                key={service.id || service.name}
                                to={`/services/${getServiceSlug(service)}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-brand-cyan"
                              >
                                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-brand-cyan">
                                  <ServiceIcon size={18} />
                                </span>
                                <span className="min-w-0 flex-1 truncate">{service.name}</span>
                              </Link>
                            );
                          })
                        ) : (
                          <p className="py-2 text-sm text-slate-500">
                            Services loading...
                          </p>
                        )}
                        <Link
                          to="/services"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl bg-brand-cyan/10 px-3 py-3 text-sm font-semibold text-white"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-cyan text-brand-dark">
                            <LayoutGrid size={18} />
                          </span>
                          <span className="min-w-0 flex-1">All Services</span>
                          <ArrowRight size={15} className="text-brand-cyan" />
                        </Link>
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
                Hire Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
