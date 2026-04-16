import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import TemplateCard from '../../components/templates/TemplateCard';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';
import Navbar from '../../components/ui/Navbar';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/templates`);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [templates]);

  const totalPages = Math.ceil(templates.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentTemplates = templates.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <>
      <Helmet>
        <title>Store - Apixel | Ready-to-Launch Website Store</title>
        <meta
          name="description"
          content="Explore premium website designs in the Apixel store for agencies, SaaS products, portfolios, and hospitality brands."
        />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        <section className="py-20 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">
                <Sparkles size={16} />
                Your Website Is Ready
              </span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-5 mb-6">
                Skip the Struggle. Start Selling Today.
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Don't lose another customer to a bad website. Choose a premium, ready-to-launch store engineered to turn clicks into cash. Zero coding. Zero delays. Just instant growth.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">
                  Choose Your Look
                </p>
                <h2 className="font-syne font-bold text-3xl md:text-5xl text-white mt-3">
                  One Decision Away From a Professional Online Presence
                </h2>
              </div>
              <p className="text-slate-400 max-w-xl">
                Real businesses are using these exact designs to get clients and close deals. Your turn.
              </p>
            </div>

            {loading ? (
              <Loading />
            ) : templates.length === 0 ? (
              <div className="card-glass text-center py-16">
                <h3 className="font-syne font-semibold text-2xl text-white mb-4">
                  No store items published yet
                </h3>
                <p className="text-slate-400 max-w-xl mx-auto">
                  New store items will appear here as soon as they are added from the admin panel and published.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentTemplates.map((template, index) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      index={(currentPage - 1) * cardsPerPage + index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="templates-pagination-prev"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-dm-sans ${
                          currentPage === i + 1
                            ? 'bg-brand-purple text-white'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                        data-testid={`templates-pagination-page-${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/5 rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="templates-pagination-next"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card-glass text-center"
            >
              <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-5">
                Need a Store Design Customized for Your Brand?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                We can adapt any layout to your content, services, and conversion goals while keeping the premium
                visual direction consistent.
              </p>
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center gap-2"
                data-testid="templates-contact-btn"
              >
                Talk About Customization
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

export default Templates;
