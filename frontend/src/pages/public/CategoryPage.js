import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import Navbar from '../../components/ui/Navbar';
import { pushPageView } from '../../utils/dataLayer';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services/categories/${categorySlug}`);
        setCategory(response.data);
        pushPageView({
          pageType: 'service_category',
          pageTitle: `${response.data.title} - Apixel Services`,
          contentGroup: 'Services',
        });
      } catch (err) {
        setError('This service category could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  return (
    <>
      <Helmet>
        <title>{category ? `${category.title} - Apixel Services` : 'Service Category - Apixel'}</title>
        <meta name="description" content={category?.description || 'Explore Apixel service sub-categories.'} />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        <section className="py-16 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Link to="/" className="hover:text-brand-cyan">Home</Link>
              <ChevronRight size={14} />
              <Link to="/services" className="hover:text-brand-cyan">Services</Link>
              {category && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-brand-cyan">{category.title}</span>
                </>
              )}
            </nav>

            {loading ? (
              <Loading />
            ) : error ? (
              <div className="card-glass text-center text-slate-300">{error}</div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Service Category</span>
                <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">{category.title}</h1>
                <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">{category.description}</p>
              </motion.div>
            )}
          </div>
        </section>

        {!loading && !error && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {category.subCategories?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {category.subCategories.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="card-glass flex h-full flex-col"
                      data-testid={`service-subcategory-card-${index}`}
                    >
                      <span className="text-brand-cyan text-xs font-bold uppercase tracking-widest">0{index + 1}</span>
                      <h2 className="font-syne text-2xl font-bold text-white mt-4 mb-3">{item.title}</h2>
                      <p className="text-slate-400 leading-relaxed flex-1">
                        {(item.overview || '').slice(0, 100)}{item.overview?.length > 100 ? '...' : ''}
                      </p>
                      <Link
                        to={`/services/${category.slug}/${item.slug}`}
                        className="mt-8 inline-flex w-fit items-center gap-2 text-brand-cyan font-medium transition-all hover:gap-3"
                        data-testid={`service-subcategory-learn-${index}`}
                      >
                        Learn More <ArrowRight size={16} />
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="card-glass text-center text-slate-300">No sub-categories are published yet.</div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;
