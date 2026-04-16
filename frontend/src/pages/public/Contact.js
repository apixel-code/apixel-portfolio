import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'Website Development (MERN)',
    'Meta & Google Ads',
    'Social Media Management',
    'Graphic Design',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, formData);
      setIsSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'contact.apixel@gmail.com', link: 'mailto:contact.apixel@gmail.com' },
    { icon: Phone, title: 'Phone', value: '+880 1754 407 239', link: 'tel:+8801754407239' },
    { icon: MapPin, title: 'Address', value: 'Baridhara, Dhaka, Bangladesh', link: null },
    { icon: Clock, title: 'Working Hours', value: 'Sun - Thu: 10AM - 7PM', link: null },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Apixel | Complete IT Solution</title>
        <meta name="description" content="Get in touch with APIXEL for your digital needs. Contact us for website development, digital marketing, social media, and design services." />
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
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Get In Touch</span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">Contact Us</h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Ready to start your project? Have questions? We'd love to hear from you.
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="font-syne font-bold text-2xl text-white mb-8">Contact Information</h2>
                
                <div className="space-y-6 mb-12">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-4" data-testid={`contact-info-${index}`}>
                        <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon size={24} className="text-brand-cyan" />
                        </div>
                        <div>
                          <h3 className="text-slate-400 text-sm mb-1">{item.title}</h3>
                          {item.link ? (
                            <a href={item.link} className="text-white hover:text-brand-cyan transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-white">{item.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Placeholder */}
                <div className="card-glass aspect-video overflow-hidden relative">
                  <iframe
                    title="APIXEL Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.68955799066!2d90.41529897690046!3d23.79991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7892e5499bb%3A0xffd7daa16a67b43e!2sBaridhara!5e0!3m2!1sen!2sbd!4v1703692800000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale opacity-80"
                  />
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {isSubmitted ? (
                  <div className="card-glass text-center py-16" data-testid="contact-success">
                    <CheckCircle size={64} className="text-brand-cyan mx-auto mb-6" />
                    <h2 className="font-syne font-bold text-2xl text-white mb-4">Message Sent!</h2>
                    <p className="text-slate-300 mb-8">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card-glass" data-testid="contact-form">
                    <h2 className="font-syne font-bold text-2xl text-white mb-8">Send Us a Message</h2>
                    
                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm text-slate-400 mb-2">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-dark"
                          placeholder="John Doe"
                          data-testid="contact-name-input"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm text-slate-400 mb-2">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-dark"
                          placeholder="john@example.com"
                          data-testid="contact-email-input"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm text-slate-400 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-dark"
                          placeholder="+880 1XXX XXXXXX"
                          data-testid="contact-phone-input"
                        />
                      </div>

                      {/* Service */}
                      <div>
                        <label htmlFor="service" className="block text-sm text-slate-400 mb-2">Service Interested In</label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="input-dark"
                          data-testid="contact-service-select"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm text-slate-400 mb-2">Your Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="input-dark resize-none"
                          placeholder="Tell us about your project..."
                          data-testid="contact-message-input"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="contact-submit-btn"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
