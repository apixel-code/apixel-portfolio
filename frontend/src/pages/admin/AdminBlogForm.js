import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';


const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'APIXEL Team',
    category: '',
    tags: '',
    thumbnailUrl: '',
    published: true,
    readTime: '5 min read',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem('apixel_token');
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/blogs?published_only=false`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const blog = response.data.find(b => b.id === id);
          if (blog) {
            setFormData({
              ...blog,
              tags: blog.tags ? blog.tags.join(', ') : '',
            });
          }
        } catch (error) {
          toast.error('Failed to fetch blog');
          navigate('/admin/blogs');
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('apixel_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/blogs/${id}`, data, { headers });
        toast.success('Blog updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/blogs`, data, { headers });
        toast.success('Blog created successfully');
      }
      
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Web Development', 'Digital Marketing', 'Social Media', 'Design', 'Technology', 'Business'];

  if (fetching) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-slate-400">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Blog' : 'New Blog'} - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <h1 className="font-syne font-bold text-2xl text-white">
              {isEdit ? 'Edit Blog' : 'New Blog'}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="blog-form">
            <div className="card-glass space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="input-dark"
                  placeholder="Enter blog title"
                  data-testid="blog-title-input"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="auto-generated-from-title"
                  data-testid="blog-slug-input"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Brief description of the blog post"
                  data-testid="blog-excerpt-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-dark"
                    data-testid="blog-category-select"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Author name"
                    data-testid="blog-author-input"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="https://example.com/image.jpg"
                  data-testid="blog-thumbnail-input"
                />
                {formData.thumbnailUrl && (
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="mt-2 h-32 rounded-lg object-cover"
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="React, Web Development, Tutorial"
                  data-testid="blog-tags-input"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="5 min read"
                  data-testid="blog-readtime-input"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Content (HTML) *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="input-dark resize-none font-mono text-sm"
                  placeholder="<h2>Introduction</h2><p>Your content here...</p>"
                  data-testid="blog-content-input"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-purple focus:ring-brand-purple"
                  data-testid="blog-published-checkbox"
                />
                <label htmlFor="published" className="text-white">Publish this blog</label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/blogs')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                data-testid="blog-submit-btn"
              >
                <Save size={18} />
                {loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminBlogForm;
