import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, ArrowLeft, Tag, Facebook, Linkedin, Twitter } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';


const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/blogs/${slug}`);
        setBlog(response.data);
        
        // Fetch related blogs
        const allBlogs = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/blogs`);
        const related = allBlogs.data
          .filter(b => b.slug !== slug && b.category === response.data.category)
          .slice(0, 3);
        setRelatedBlogs(related);
      } catch (err) {
        setError('Blog post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="bg-brand-dark min-h-screen pt-32 text-center">
          <h1 className="text-2xl text-white mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-brand-cyan hover:underline">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} - Apixel Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.thumbnailUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
      </Helmet>

      <Navbar />

      <main className="bg-brand-dark min-h-screen pt-20">
        {/* Hero */}
        <section className="py-16 bg-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 via-transparent to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-cyan mb-8 transition-colors"
                data-testid="back-to-blog"
              >
                <ArrowLeft size={18} />
                Back to Blog
              </Link>

              <span className="inline-block px-3 py-1 bg-brand-purple/20 text-brand-cyan text-sm font-dm-sans rounded-full mb-4">
                {blog.category}
              </span>

              <h1 className="font-syne font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <User size={16} className="text-brand-cyan" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-cyan" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-cyan" />
                  {blog.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.thumbnailUrl && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="aspect-video rounded-2xl overflow-hidden"
            >
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </section>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-syne prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-slate-300 prose-ul:my-6
              prose-ol:text-slate-300 prose-ol:my-6
              prose-li:my-2
              prose-code:text-brand-cyan prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            data-testid="blog-content"
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/10">
              <Tag size={18} className="text-slate-500" />
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/5 rounded-full text-sm text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <span className="text-slate-400 text-sm">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
              data-testid="share-facebook"
            >
              <Facebook size={18} className="text-slate-400 hover:text-white" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blog.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
              data-testid="share-twitter"
            >
              <Twitter size={18} className="text-slate-400 hover:text-white" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${blog.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-colors"
              data-testid="share-linkedin"
            >
              <Linkedin size={18} className="text-slate-400 hover:text-white" />
            </a>
          </div>
        </article>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-brand-purple/5 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-syne font-bold text-2xl text-white mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((related, index) => (
                  <motion.article
                    key={related.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card-glass group"
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-lg mb-4 bg-brand-dark">
                      <img
                        src={related.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-syne font-semibold text-lg text-white mb-2 group-hover:text-brand-cyan transition-colors line-clamp-2">
                      <Link to={`/blog/${related.slug}`}>{related.title}</Link>
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{related.excerpt}</p>
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

export default BlogPost;
