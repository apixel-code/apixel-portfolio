import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { resolveImageUrl } from '../../utils/imageUrl';

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  description: '',
  thumbnailUrl: '',
  gallery: '',
  tags: '',
  features: '',
  priceLabel: '',
  status: 'Available',
  techStack: '',
  useCases: '',
  valuePoints: '',
  demoUrl: '',
  ctaLabel: 'Get This Store Item',
  published: true,
};

const parseCommaSeparated = (value) =>
  value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];

const AdminTemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchTemplate = async () => {
        try {
          const token = localStorage.getItem('apixel_token');
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/templates?published_only=false`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const template = response.data.find((item) => item.id === id);
          if (template) {
            setFormData({
              ...template,
              gallery: template.gallery?.join(', ') || '',
              tags: template.tags?.join(', ') || '',
              features: template.features?.join(', ') || '',
              techStack: template.techStack?.join(', ') || '',
              useCases: template.useCases?.join(', ') || '',
              valuePoints: template.valuePoints?.join(', ') || '',
            });
          }
        } catch (error) {
          toast.error('Failed to fetch store item');
          navigate('/admin/templates');
        } finally {
          setFetching(false);
        }
      };
      fetchTemplate();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

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
        gallery: parseCommaSeparated(formData.gallery),
        tags: parseCommaSeparated(formData.tags),
        features: parseCommaSeparated(formData.features),
        techStack: parseCommaSeparated(formData.techStack),
        useCases: parseCommaSeparated(formData.useCases),
        valuePoints: parseCommaSeparated(formData.valuePoints),
      };

      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/templates/${id}`, data, { headers });
        toast.success('Store item updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/templates`, data, { headers });
        toast.success('Store item created successfully');
      }

      navigate('/admin/templates');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save store item');
    } finally {
      setLoading(false);
    }
  };

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
        <title>{isEdit ? 'Edit Store Item' : 'New Store Item'} - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/admin/templates')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <h1 className="font-syne font-bold text-2xl text-white">
              {isEdit ? 'Edit Store Item' : 'New Store Item'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="template-form">
            <div className="card-glass space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="input-dark"
                  placeholder="Enter store item title"
                  data-testid="template-title-input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="auto-generated-from-title"
                  data-testid="template-slug-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-dark"
                    placeholder="Business, SaaS, Portfolio..."
                    data-testid="template-category-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Price Label</label>
                  <input
                    type="text"
                    name="priceLabel"
                    value={formData.priceLabel}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="$99"
                    data-testid="template-price-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Short card description"
                  data-testid="template-excerpt-input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-dark resize-none"
                  placeholder="Longer description for the store detail page"
                  data-testid="template-description-input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="Google Drive link, Drive file ID, or direct image URL"
                  data-testid="template-thumbnail-input"
                />
                {formData.thumbnailUrl && (
                  <img
                    src={resolveImageUrl(formData.thumbnailUrl)}
                    alt="Store item thumbnail preview"
                    className="mt-3 h-36 rounded-xl object-cover border border-white/10"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Gallery URLs (comma-separated)</label>
                <textarea
                  name="gallery"
                  value={formData.gallery}
                  onChange={handleChange}
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="https://image1.jpg, https://image2.jpg"
                  data-testid="template-gallery-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Responsive, Premium, Lead Gen"
                    data-testid="template-tags-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Available"
                    data-testid="template-status-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Features (comma-separated)</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Hero section, Gallery, CTA blocks"
                  data-testid="template-features-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="React, Tailwind"
                    data-testid="template-stack-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Use Cases (comma-separated)</label>
                  <input
                    type="text"
                    name="useCases"
                    value={formData.useCases}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Agencies, Startups, Portfolios"
                    data-testid="template-usecases-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Value Points (comma-separated)</label>
                <textarea
                  name="valuePoints"
                  value={formData.valuePoints}
                  onChange={handleChange}
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Responsive by default, Conversion-first structure"
                  data-testid="template-valuepoints-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Demo URL</label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="https://example.com/demo"
                    data-testid="template-demo-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">CTA Label</label>
                  <input
                    type="text"
                    name="ctaLabel"
                    value={formData.ctaLabel}
                    onChange={handleChange}
                    className="input-dark"
                    placeholder="Get This Store Item"
                    data-testid="template-cta-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-purple focus:ring-brand-purple"
                  data-testid="template-published-checkbox"
                />
                <label htmlFor="published" className="text-white">Publish this template</label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/templates')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                data-testid="template-submit-btn"
              >
                <Save size={18} />
                {loading ? 'Saving...' : (isEdit ? 'Update Store Item' : 'Create Store Item')}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminTemplateForm;
