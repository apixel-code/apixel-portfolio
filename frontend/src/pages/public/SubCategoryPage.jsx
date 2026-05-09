import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import Navbar from '../../components/ui/Navbar';
import { pushPageView, pushViewItem } from '../../utils/dataLayer';

const SubCategoryPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services/subcategories/${subCategorySlug}`);
        setSubCategory(response.data);
        pushPageView({
          pageType: 'service_subcategory',
          pageTitle: `${response.data.title} - Apixel Services`,
          contentGroup: 'Services',
        });
        pushViewItem({
          item: response.data,
          itemListName: response.data.category?.title || 'Services',
        });
      } catch (err) {
        setError('This service detail page could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [subCategorySlug]);

  const category = subCategory?.category;

  return (
    <>
      <Helmet>
        <title>{subCategory ? `${subCategory.title} - Apixel Services` : 'Service Detail - Apixel'}</title>
        <meta name="description" content={subCategory?.hero?.subheadline || subCategory?.overview || 'Explore Apixel service details.'} />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        {loading ? (
          <section className="py-20">
            <Loading />
          </section>
        ) : error ? (
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="card-glass text-center text-slate-300">{error}</div>
            </div>
          </section>
        ) : (
          <>
            <section className="py-16 md:py-24 bg-grid relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-brand-purple/20 via-transparent to-transparent" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <Link to="/" className="hover:text-brand-cyan">Home</Link>
                  <ChevronRight size={14} />
                  <Link to="/services" className="hover:text-brand-cyan">Services</Link>
                  <ChevronRight size={14} />
                  <Link to={`/services/${category?.slug || categorySlug}`} className="hover:text-brand-cyan">
                    {category?.title || 'Category'}
                  </Link>
                  <ChevronRight size={14} />
                  <span className="text-brand-cyan">{subCategory.title}</span>
                </nav>

                <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">{category?.title}</span>
                  <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6 max-w-4xl">
                    {subCategory.hero?.headline || subCategory.title}
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl max-w-3xl leading-relaxed">
                    {subCategory.hero?.subheadline}
                  </p>
                </motion.div>
              </div>
            </section>

            <section className="py-16 md:py-20">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <section>
                  <span className="text-brand-cyan text-sm font-bold uppercase tracking-widest">Overview</span>
                  <p className="mt-4 text-lg text-slate-300 leading-relaxed">{subCategory.overview}</p>
                </section>

                <section>
                  <span className="text-brand-cyan text-sm font-bold uppercase tracking-widest">What's Included</span>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subCategory.whatsIncluded?.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                        <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-brand-gold" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <span className="text-brand-cyan text-sm font-bold uppercase tracking-widest">Our Process</span>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {subCategory.process?.map((step, index) => (
                      <div key={step} className="rounded-xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-white font-syne font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-brand-cyan/20 bg-brand-cyan/10 p-6 md:p-8">
                  <span className="text-brand-cyan text-sm font-bold uppercase tracking-widest">Best For</span>
                  <p className="mt-4 text-lg text-white leading-relaxed">{subCategory.bestFor}</p>
                </section>

                <section className="card-glass text-center">
                  <h2 className="font-syne text-3xl font-bold text-white mb-4">Ready to Move Forward?</h2>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                    Tell us about your goals and we will recommend the right next step for this service.
                  </p>
                  <Link to="/contact" className="btn-primary inline-flex items-center gap-2" data-testid="service-detail-cta">
                    {subCategory.cta || 'Start Your Project'} <ArrowRight size={18} />
                  </Link>
                </section>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default SubCategoryPage;
