import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Store', path: '/templates' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    'Website Development',
    'Meta & Google Ads',
    'Social Media Management',
    'Graphic Design',
  ];

  return (
    <footer className="bg-brand-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3" aria-label="Apixel Home">
              <img 
                src="/assets/f.png" 
                alt="Apixel Logo" 
                className="h-16 sm:h-20 w-auto object-contain mix-blend-screen"
                style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.24))' }}
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Apixel - Complete IT Solution. Propelling businesses into the future with cutting-edge digital solutions. 
              Your success is our mission.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/apixelltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
                data-testid="footer-facebook-link"
              >
                <Facebook size={20} className="text-slate-400 hover:text-brand-cyan" />
              </a>
              <a 
                href="https://www.instagram.com/apixel_net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
                data-testid="footer-instagram-link"
              >
                <Instagram size={20} className="text-slate-400 hover:text-brand-cyan" />
              </a>
              <a 
                href="https://linkedin.com/company/apixelnet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
                data-testid="footer-linkedin-link"
              >
                <Linkedin size={20} className="text-slate-400 hover:text-brand-cyan" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-syne font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-brand-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-syne font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    to="/services"
                    className="text-slate-400 hover:text-brand-cyan transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-syne font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-cyan mt-0.5" />
                <a 
                  href="mailto:contact.apixel@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  contact.apixel@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-cyan mt-0.5" />
                <a 
                  href="tel:+8801754407239"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  +880 1754 407 239
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-cyan mt-0.5" />
                <span className="text-slate-400 text-sm">
                  Baridhara, Dhaka, Bangladesh
                </span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white text-sm font-medium mb-3">Subscribe to Newsletter</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="input-dark text-sm py-2 flex-1"
                  data-testid="newsletter-email-input"
                />
                <button 
                  className="p-2 bg-brand-purple rounded-lg hover:bg-brand-purple/80 transition-colors"
                  data-testid="newsletter-submit-btn"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Apixel. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
