import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers3, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TemplateFeatureList from '../../components/templates/TemplateFeatureList';
import TemplateGallery from '../../components/templates/TemplateGallery';
import TemplateSummaryCard from '../../components/templates/TemplateSummaryCard';
import TemplateValueStrip from '../../components/templates/TemplateValueStrip';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import Navbar from '../../components/ui/Navbar';
import { resolveImageUrl } from '../../utils/imageUrl';

const TemplateDetails = () => {
  const { slug } = useParams();
  const [template, setTemplate] = useState(null);
  const [relatedTemplates, setRelatedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const [templateRes, templatesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/templates/${slug}`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/templates`),
        ]);

        setTemplate(templateRes.data);
        const allTemplates = templatesRes.data || [];
        const currentCategory = templateRes.data.category;
        const nextRelatedTemplates = allTemplates
          .filter((item) => item.slug !== slug && item.category === currentCategory)
          .concat(allTemplates.filter((item) => item.slug !== slug && item.category !== currentCategory))
          .slice(0, 3);
        setRelatedTemplates(nextRelatedTemplates);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Error fetching template:', error);
        }
        setTemplate(null);
        setRelatedTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-brand-dark min-h-screen pt-32">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !template) {
    return (
      <>
        <Helmet>
          <title>Store Item Not Found - Apixel</title>
          <meta name="description" content="The requested store item could not be found." />
        </Helmet>

        <Navbar />

        <main className="bg-brand-dark min-h-screen pt-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-glass">
              <p className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest mb-4">
                Store Item Missing
              </p>
              <h1 className="font-syne font-bold text-3xl md:text-5xl text-white mb-4">
                This store item is not available
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                The store item you requested may have been removed or the link may be incorrect.
              </p>
              <Link to="/templates" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={18} />
                Back to Store
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{template.title} - Apixel Store</title>
        <meta name="description" content={template.excerpt} />
        <meta property="og:title" content={template.title} />
        <meta property="og:description" content={template.excerpt} />
        <meta property="og:image" content={resolveImageUrl(template.thumbnailUrl)} />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        <section className="py-16 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-cyan mb-8 transition-colors"
                data-testid="template-details-back-btn"
              >
                <ArrowLeft size={18} />
                Back to Store
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-purple/20 text-brand-cyan text-sm rounded-full font-medium">
                      <Layers3 size={14} />
                      {template.category}
                    </span>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-dm-sans font-medium ${
                      template.status === 'Available'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {template.status}
                    </span>
                  </div>

                  <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
                    {template.title}
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-6">
                    {template.description}
                  </p>

                  {template.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <TemplateSummaryCard template={template} />
              </div>
            </motion.div>
          </div>
        </section>

        <TemplateGallery title={template.title} heroImage={template.thumbnailUrl} gallery={template.gallery} />

        <TemplateValueStrip items={template.valuePoints || []} />

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TemplateFeatureList features={template.features} />

              <div className="card-glass">
                <p className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest mb-4">
                  Who Is This For
                </p>
                <h2 className="font-syne font-bold text-3xl text-white mb-6">
                  Perfect If You Need a Professional Site — Fast
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  You don't want to wait months. You want a clean, credible website that works on every device and makes your visitors take action. This is built for that.
                </p>
                {(template.useCases || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(template.useCases || []).map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-slate-300 border border-white/10">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="template-details-order-btn"
                >
                  Order This Design Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {relatedTemplates.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-brand-purple/5 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-syne font-bold text-3xl text-white mb-8">Related Store Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {relatedTemplates.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="card-glass group"
                  >
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 bg-brand-dark">
                      <img
                        src={resolveImageUrl(item.thumbnailUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-brand-cyan text-sm mb-2">{item.category}</p>
                    <h3 className="font-syne font-semibold text-2xl text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 mb-5">{item.excerpt}</p>
                    <Link
                      to={`/templates/${item.slug}`}
                      className="inline-flex items-center gap-2 text-brand-cyan font-medium"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default TemplateDetails;
