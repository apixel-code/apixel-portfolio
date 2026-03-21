import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import Loading from '../../components/ui/Loading';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blogs`);
        setBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    setFilteredBlogs(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, blogs]);

  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog - APIXEL Digital Agency</title>
        <meta name="description" content="Read our latest insights on web development, digital marketing, social media trends, and design tips." />
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
              <span className="text-brand-cyan text-sm font-dm-sans font-bold uppercase tracking-widest">Our Blog</span>
              <h1 className="font-syne font-bold text-4xl md:text-6xl text-white mt-4 mb-6">Insights & Updates</h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Stay ahead of the curve with our latest articles on web development, 
                digital marketing, and industry trends.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-dark pl-12 w-full"
                  data-testid="blog-search-input"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-all ${
                      selectedCategory === category
                        ? 'bg-brand-purple text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                    data-testid={`category-filter-${category.toLowerCase().replace(' ', '-')}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <Loading />
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No articles found. Try adjusting your search or filter.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentBlogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="card-glass group overflow-hidden"
                      data-testid={`blog-card-${index}`}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video w-full overflow-hidden rounded-lg mb-6 bg-brand-dark">
                        <img
                          src={blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Category */}
                      <span className="inline-block px-3 py-1 bg-brand-purple/20 text-brand-cyan text-xs font-dm-sans rounded-full mb-4">
                        {blog.category}
                      </span>

                      {/* Title */}
                      <h2 className="font-syne font-semibold text-xl text-white mb-3 group-hover:text-brand-cyan transition-colors line-clamp-2">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {blog.readTime}
                        </span>
                      </div>

                      {/* Read More */}
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="text-brand-cyan text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                      >
                        Read More <ArrowRight size={16} />
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="pagination-prev"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-dm-sans ${
                          currentPage === i + 1
                            ? 'bg-brand-purple text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="pagination-next"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
