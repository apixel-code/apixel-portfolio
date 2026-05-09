import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Megaphone, Palette, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import Navbar from '../../components/ui/Navbar';
import { pushPageView, pushViewItemList } from '../../utils/dataLayer';

const iconMap = {
  Code,
  FaCode: Code,
  Database,
  Palette,
  Target,
  Megaphone,
  Users,
};

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    pushPageView({
      pageType: 'service_categories',
      pageTitle: 'Services - Apixel',
      contentGroup: 'Services',
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Unable to load services right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      pushViewItemList({
        items: categories,
        itemListId: 'service_categories',
        itemListName: 'Service Categories',
      });
    }
  }, [categories, loading]);

  return (
    <>
      <Helmet>
        <title>Services - Apixel | Complete IT Solution</title>
        <meta name="description" content="Explore Apixel service categories across development, design, marketing, media, and IT consulting." />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        <section className="py-20 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Services</span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">What We Can Build for You</h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Choose a service category to explore focused solutions for your website, product, brand, and growth systems.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="card-glass text-center text-slate-300">{error}</div>
            ) : categories.length === 0 ? (
              <div className="card-glass text-center text-slate-300">No services are published yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.map((category, index) => {
                  const Icon = iconMap[category.icon] || Code;

                  return (
                    <motion.article
                      key={category.id}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="card-glass flex h-full flex-col"
                      data-testid={`service-category-card-${index}`}
                    >
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan">
                        <Icon size={26} />
                      </div>
                      <h2 className="font-syne text-2xl font-bold text-white mb-3">{category.title}</h2>
                      <p className="text-slate-400 leading-relaxed flex-1">{category.description}</p>
                      <Link
                        to={`/services/${category.slug}`}
                        className="mt-8 inline-flex w-fit items-center gap-2 text-brand-cyan font-medium transition-all hover:gap-3"
                        data-testid={`service-category-explore-${index}`}
                      >
                        Explore <ArrowRight size={16} />
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServicesPage;
