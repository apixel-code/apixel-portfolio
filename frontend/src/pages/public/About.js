import axios from 'axios';
import { motion } from 'framer-motion';
import { Code, Database, Eye, Globe, Heart, Palette, Rocket, Smartphone, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/ui/Footer';
import Navbar from '../../components/ui/Navbar';
import { pushPageView } from '../../utils/dataLayer';
import { resolveImageUrl } from '../../utils/imageUrl';

const DEFAULT_TEAM = [
  {
    name: 'Mahabub Islam',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    name: 'Tanvir Ahmed',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  },
  {
    name: 'Sabrina Rahman',
    role: 'Marketing Head',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  },
  {
    name: 'Rifat Hossain',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  },
];

const About = () => {
  const [team, setTeam] = useState(DEFAULT_TEAM);

  useEffect(() => {
    pushPageView({
      pageType: 'about',
      pageTitle: 'About - Apixel',
      contentGroup: 'Marketing Pages',
    });
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/experts`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTeam(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch experts, using defaults:', error);
      }
    };

    fetchExperts();
  }, []);

  const values = [
    { icon: Target, title: 'Mission', description: 'To propel businesses into the future with cutting-edge digital solutions that drive growth and success.' },
    { icon: Eye, title: 'Vision', description: 'To become the most trusted digital partner for businesses across Bangladesh and beyond.' },
    { icon: Heart, title: 'Values', description: 'Innovation, integrity, client success, and continuous learning guide everything we do.' },
  ];

  const techStack = [
    { icon: Code, name: 'React.js' },
    { icon: Database, name: 'Node.js' },
    { icon: Database, name: 'MongoDB' },
    { icon: Globe, name: 'Express.js' },
    { icon: Palette, name: 'Figma' },
    { icon: Smartphone, name: 'React Native' },
    { icon: Zap, name: 'Next.js' },
    { icon: Globe, name: 'AWS' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Apixel | Complete IT Solution</title>
        <meta name="description" content="Learn about APIXEL, our mission, vision, and the talented team behind our digital solutions." />
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
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">About Us</span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">Our Story</h1>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Founded in Dhaka, Bangladesh, APIXEL emerged from a passion for digital excellence. 
                We're a team of developers, marketers, and designers united by one goal: 
                helping businesses thrive in the digital age.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="card-glass aspect-square max-w-lg overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                    alt="APIXEL Team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-6">
                  Building Digital Dreams Since Day One
                </h2>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    What started as a small team of tech enthusiasts has grown into a full-service 
                    digital agency. We've helped businesses of all sizes—from startups to established 
                    enterprises—achieve their digital potential.
                  </p>
                  <p>
                    Our expertise spans the entire digital spectrum: from crafting beautiful, 
                    functional websites using the MERN stack to running high-converting ad campaigns 
                    with advanced tracking and analytics.
                  </p>
                  <p>
                    At APIXEL, we don't just deliver projects—we build partnerships. Every client's 
                    success story adds to our journey of growth and innovation.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 mt-10">
                  <div className="text-center">
                    <div className="font-syne font-bold text-3xl text-brand-cyan">5+</div>
                    <div className="text-slate-400 text-sm">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="font-syne font-bold text-3xl text-brand-cyan">80+</div>
                    <div className="text-slate-400 text-sm">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="font-syne font-bold text-3xl text-brand-cyan">150+</div>
                    <div className="text-slate-400 text-sm">Projects</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card-glass text-center"
                    data-testid={`value-card-${index}`}
                  >
                    <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon size={32} className="text-brand-gold" />
                    </div>
                    <h3 className="font-syne font-semibold text-xl text-white mb-4">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Our Team</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Meet the Experts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id || member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-glass text-center group"
                  data-testid={`team-member-${index}`}
                >
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-brand-purple/30 group-hover:border-brand-cyan transition-colors">
                    <img
                      src={resolveImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-syne font-semibold text-lg text-white mb-1">{member.name}</h3>
                  <p className="text-brand-cyan text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Technologies</span>
              <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-4">Our Tech Stack</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all"
                  >
                    <Icon size={32} className="text-brand-cyan mx-auto mb-2" />
                    <span className="text-slate-400 text-xs">{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card-glass py-16"
            >
              <Rocket size={48} className="text-brand-cyan mx-auto mb-6" />
              <h2 className="font-syne font-bold text-3xl text-white mb-4">Ready to Work With Us?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Let's create something amazing together. Get in touch and let's discuss your project.
              </p>
              <a
                href="/contact"
                className="btn-primary inline-block"
                data-testid="about-cta-btn"
              >
                Start a Conversation
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
