import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Award, ChevronLeft, ChevronRight, Code, Palette, Share2, Star, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Navbar from '../../components/ui/Navbar';


// Typewriter Effect Component
const TypewriterText = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-brand-cyan">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Section Animation Wrapper
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const serviceIcons = {
    'Code': Code,
    'Target': Target,
    'Share2': Share2,
    'Palette': Palette,
  };

  const testimonials = [
    {
      name: 'Rahman Ahmed',
      company: 'TechStart BD',
      content: 'APIXEL transformed our online presence completely. Their MERN stack expertise delivered a website that exceeded our expectations. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Sarah Khan',
      company: 'Fashion Hub',
      content: 'The Meta Ads campaign they ran for us generated 3x ROAS within the first month. Their Conversion API setup made tracking seamless.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      company: 'Global Traders',
      content: 'Professional, creative, and results-driven. Their social media management grew our following by 200% in just 6 months.',
      rating: 5,
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const stats = [
    { label: 'Projects Completed', value: 150, suffix: '+' },
    { label: 'Happy Clients', value: 80, suffix: '+' },
    { label: 'Years Experience', value: 5, suffix: '+' },
    { label: 'Ads Managed', value: 500, suffix: 'K+' },
  ];

  const whyChooseUs = [
    { icon: Zap, title: 'Fast Delivery', description: 'Quick turnaround without compromising quality' },
    { icon: Users, title: 'Expert Team', description: 'Skilled professionals with years of experience' },
    { icon: Award, title: 'Quality First', description: 'Premium solutions tailored to your needs' },
    { icon: TrendingUp, title: 'Result Driven', description: 'Focus on ROI and measurable outcomes' },
  ];

  return (
    <>
      <Helmet>
        <title>Apixel - Complete IT Solution</title>
        <meta name="description" content="Apixel - Complete IT Solution. Premier IT Agency offering Website Development (MERN), Meta & Google Ads with Conversion API, Social Media Management, and Graphic Design services." />
        <meta property="og:title" content="Apixel - Complete IT Solution" />
        <meta property="og:description" content="Transform your digital presence with cutting-edge solutions from Apixel." />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-grid pt-20">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse-slow" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-brand-purple/20 rounded-full border border-brand-purple/30 mb-8"
              >
                <span className="text-brand-cyan text-sm font-dm-sans">Welcome to Apixel</span>
              </motion.div>

              <h1 className="font-syne font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                We Build{' '}
                <TypewriterText 
                  words={['Websites', 'Ad Campaigns', 'Social Presence', 'Brand Identity']} 
                />
              </h1>

              <p className="font-dm-sans text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                Propelling businesses into the future with cutting-edge digital solutions. 
                From MERN stack development to high-converting ad campaigns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="hero-get-consultation-btn"
                >
                  Get Free Consultation
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services"
                  className="btn-secondary inline-flex items-center gap-2"
                  data-testid="hero-view-work-btn"
                >
                  View Our Services
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Services Section */}
        <AnimatedSection className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">What We Do</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Our Services</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = serviceIcons[service.icon] || Code;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="card-glass group cursor-pointer"
                    data-testid={`service-card-${index}`}
                  >
                    <div className="w-14 h-14 bg-brand-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-purple/40 transition-colors">
                      <IconComponent size={28} className="text-brand-cyan" />
                    </div>
                    <h3 className="font-syne font-semibold text-xl text-white mb-3">{service.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.description}</p>
                    <Link 
                      to="/contact" 
                      className="text-brand-cyan text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <div className="font-syne font-bold text-4xl md:text-5xl text-white mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-slate-400 font-dm-sans text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Why Us</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Why Choose Apixel</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon size={32} className="text-brand-gold" />
                    </div>
                    <h3 className="font-syne font-semibold text-xl text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Testimonials</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">What Clients Say</h2>
            </div>

            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="card-glass text-center py-12"
                data-testid="testimonial-card"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-slate-300 italic mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <div>
                  <p className="font-syne font-semibold text-white">{testimonials[currentTestimonial].name}</p>
                  <p className="text-brand-cyan text-sm">{testimonials[currentTestimonial].company}</p>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="testimonial-prev-btn"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-brand-cyan' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid="testimonial-next-btn"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-glass text-center py-16 px-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-transparent to-brand-cyan/20" />
              <div className="relative z-10">
                <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Let's discuss how Apixel can help you achieve your digital goals. 
                  Get a free consultation today!
                </p>
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="cta-contact-btn"
                >
                  Start Your Project
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </>
  );
};

export default Home;
