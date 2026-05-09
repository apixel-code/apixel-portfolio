import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BadgeCheck, CalendarClock, Clock, Code, Megaphone, Palette, Share2, Star, Target, User, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Navbar from '../../components/ui/Navbar';
import { pushPageView } from '../../utils/dataLayer';


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

const MotionLink = motion(Link);

const getServicePath = (service) => {
  const slug = service.slug || service.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `/services/${slug}`;
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

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
    pushPageView({
      pageType: 'home',
      pageTitle: 'Home - Apixel',
      contentGroup: 'Marketing Pages',
    });
  }, []);

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
    const fetchRecentBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogs`);
        setRecentBlogs(Array.isArray(response.data) ? response.data.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
      }
    };
    fetchRecentBlogs();
  }, []);

  const stats = [
    { label: 'Projects Completed', value: 150, suffix: '+', icon: BadgeCheck },
    { label: 'Happy Clients', value: 80, suffix: '+', icon: Users },
    { label: 'Years Experience', value: 5, suffix: '+', icon: CalendarClock },
    { label: 'Ads Managed', value: 500, suffix: 'K+', icon: Megaphone },
  ];

  const prestigiousClients = [
    'TechStart BD',
    'Fashion Hub',
    'Global Traders',
    'Urban Nest',
    'EduCare Plus',
    'HealthBridge',
    'RetailX',
    'Nexa Foods',
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
        <section className="relative min-h-[82vh] flex items-center justify-center bg-grid pt-20 pb-10">
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
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

        {/* Prestigious Clients */}
        <section className="client-marquee-section py-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="text-center">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Trusted By</span>
              <h2 className="font-syne font-bold text-2xl md:text-4xl text-white mt-3">
                Prestigious Clients We Have Worked With
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="client-marquee-fade client-marquee-fade-left" />
            <div className="client-marquee-fade client-marquee-fade-right" />

            <motion.div
              className="flex w-max gap-5"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              {[...prestigiousClients, ...prestigiousClients].map((client, index) => (
                <div
                  key={`${client}-${index}`}
                  className="client-logo-card min-w-[190px] h-20 px-6 flex items-center justify-center"
                >
                  <span className="client-logo-text font-syne font-semibold text-lg whitespace-nowrap">
                    {client}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <AnimatedSection className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">What We Do</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Our Services</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = serviceIcons[service.icon] || Code;
                return (
                  <MotionLink
                    to={getServicePath(service)}
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="service-card-home group"
                    data-testid={`service-card-${index}`}
                    aria-label={`View ${service.name} service details`}
                  >
                    <div className="service-card-home__glow" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="service-card-home__icon">
                          <IconComponent size={24} />
                        </div>
                      </div>

                      <h3 className="font-syne font-semibold text-lg text-white mb-2 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                        {service.description}
                      </p>

                      <span className="service-card-home__link">
                        View Service <ArrowRight size={16} />
                      </span>
                    </div>
                  </MotionLink>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="stats-section py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="stats-shell relative overflow-hidden rounded-2xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="stats-shell__line absolute inset-x-0 top-0 h-px" />
              <motion.div
                className="stats-shell__beam absolute top-0 h-full w-32"
                animate={{ x: ['-140%', '920%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10 mb-8 flex flex-col items-center gap-3 text-center">
                <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Our Impact</span>
                <h2 className="font-syne font-bold text-3xl md:text-4xl text-white">Numbers That Tell the Story</h2>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className="stats-card group relative min-h-[172px] overflow-hidden rounded-2xl p-5"
                      data-testid={`stat-${index}`}
                    >
                      <div className="stats-card__accent absolute inset-x-0 top-0 h-1" />
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <motion.div
                          className="stats-card__icon flex h-12 w-12 items-center justify-center rounded-xl"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Icon size={22} />
                        </motion.div>
                      </div>
                      <div className="stats-card__number font-syne font-bold text-4xl md:text-5xl mb-2">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="stats-card__label font-dm-sans text-sm">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Recent Blog */}
        <AnimatedSection className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Recent Blog</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Latest Insights</h2>
            </div>

            {recentBlogs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentBlogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group h-full flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
                      data-testid={`home-recent-blog-card-${index}`}
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden bg-brand-dark">
                        <img
                          src={blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <span className="inline-block w-fit px-3 py-1 bg-brand-purple/20 text-brand-cyan text-xs font-dm-sans rounded-full mb-3">
                          {blog.category}
                        </span>

                        <h3 className="font-syne font-semibold text-xl text-white mb-3 group-hover:text-brand-cyan transition-colors line-clamp-2">
                          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>

                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{blog.excerpt}</p>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1 truncate">
                            <User size={14} />
                            {blog.author}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <Clock size={14} />
                            {blog.readTime}
                          </span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/10">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="text-brand-cyan text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                          >
                            Read More <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <Link
                    to="/blog"
                    className="btn-secondary inline-flex items-center gap-2"
                    data-testid="home-recent-blog-view-all"
                  >
                    View All Articles
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Testimonials</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">What Clients Say</h2>
            </div>

            <div className="relative">
              <div className="overflow-hidden" data-testid="testimonial-marquee">
                <motion.div
                  className="flex w-max gap-6"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
                >
                  {[...testimonials, ...testimonials].map((item, idx) => (
                    <article
                      key={`${item.name}-${idx}`}
                      className="card-glass flex min-h-[310px] w-[300px] flex-shrink-0 flex-col justify-between p-6 text-left sm:w-[360px] md:w-[410px]"
                      data-testid={`testimonial-card-${idx}`}
                    >
                      <div>
                        <div className="flex gap-1 mb-5">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={18} className="text-brand-gold fill-brand-gold" />
                          ))}
                        </div>
                        <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                          "{item.content}"
                        </p>
                      </div>

                      <div className="mt-8 border-t border-white/10 pt-5">
                        <p className="font-syne font-semibold text-white">{item.name}</p>
                        <p className="text-brand-cyan text-sm">{item.company}</p>
                      </div>
                    </article>
                  ))}
                </motion.div>
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
