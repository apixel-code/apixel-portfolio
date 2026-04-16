import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Code, Target, Share2, Palette, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';


const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceIcons = {
    'Code': Code,
    'Target': Target,
    'Share2': Share2,
    'Palette': Palette,
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services - Apixel | Complete IT Solution</title>
        <meta name="description" content="Explore our comprehensive digital services including MERN Stack Web Development, Meta & Google Ads, Social Media Management, and Graphic Design." />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">What We Offer</span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">Our Services</h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Comprehensive digital solutions tailored to propel your business forward. 
                From development to marketing, we've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <Loading />
            ) : (
              <div className="space-y-16">
                {services.map((service, index) => {
                  const IconComponent = serviceIcons[service.icon] || Code;
                  const isEven = index % 2 === 0;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                      data-testid={`service-detail-${index}`}
                    >
                      {/* Icon/Visual Side */}
                      <div className="flex-1 w-full">
                        <div className="card-glass aspect-square max-w-md mx-auto flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-cyan/10" />
                          <IconComponent size={120} className="text-brand-cyan relative z-10" />
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-purple/30 rounded-full blur-3xl" />
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1">
                        <div className="inline-block px-4 py-2 bg-brand-purple/20 rounded-full border border-brand-purple/30 mb-4">
                          <span className="text-brand-cyan text-sm font-dm-sans">Service 0{index + 1}</span>
                        </div>
                        <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-4">{service.name}</h2>
                        <p className="text-slate-300 text-lg mb-6 leading-relaxed">{service.description}</p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle size={18} className="text-brand-gold flex-shrink-0" />
                              <span className="text-slate-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Price Range */}
                        <div className="flex items-center gap-4 mb-8">
                          <span className="text-slate-400 text-sm">Starting from:</span>
                          <span className="font-syne font-semibold text-xl text-brand-gold">{service.priceRange}</span>
                        </div>

                        <Link
                          to="/contact"
                          className="btn-primary inline-flex items-center gap-2"
                          data-testid={`service-get-started-${index}`}
                        >
                          Get Started
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-6">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Let's have a conversation about your goals. We'll recommend the best solutions for your business.
              </p>
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center gap-2"
                data-testid="services-cta-btn"
              >
                Schedule a Free Consultation
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Services;
