import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const emptyForm = {
  title: '',
  category: '',
  heroHeadline: '',
  heroSubheadline: '',
  overview: '',
  whatsIncluded: [''],
  process: [''],
  bestFor: '',
  cta: '',
  isActive: true,
  order: 1,
};

const AdminServiceSubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = useCallback(() => ({ Authorization: `Bearer ${localStorage.getItem('apixel_token')}` }), []);

  const fetchCategories = useCallback(async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services/admin/categories`, {
      headers: headers(),
    });
    setCategories(response.data);
    setFormData((prev) => (
      !prev.category && response.data[0]?.id ? { ...prev, category: response.data[0].id } : prev
    ));
  }, [headers]);

  const fetchSubCategories = useCallback(async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/services/admin/subcategories${filterCategory ? `?category=${filterCategory}` : ''}`;
    const response = await axios.get(url, { headers: headers() });
    setSubCategories(response.data);
  }, [filterCategory, headers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories();
      } catch (error) {
        toast.error('Failed to load service categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCategories]);

  useEffect(() => {
    fetchSubCategories().catch(() => toast.error('Failed to filter sub-categories'));
  }, [fetchSubCategories]);

  const resetForm = () => {
    setFormData({ ...emptyForm, category: categories[0]?.id || '' });
    setEditingId('');
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const updateListItem = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category?.id || item.category || '',
      heroHeadline: item.hero?.headline || '',
      heroSubheadline: item.hero?.subheadline || '',
      overview: item.overview || '',
      whatsIncluded: item.whatsIncluded?.length ? item.whatsIncluded : [''],
      process: item.process?.length ? item.process : [''],
      bestFor: item.bestFor || '',
      cta: item.cta || '',
      isActive: item.isActive ?? true,
      order: item.order || 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sub-category?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/services/subcategories/${id}`, {
        headers: headers(),
      });
      toast.success('Sub-category deleted successfully');
      fetchSubCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete sub-category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title,
      category: formData.category,
      hero: {
        headline: formData.heroHeadline,
        subheadline: formData.heroSubheadline,
      },
      overview: formData.overview,
      whatsIncluded: formData.whatsIncluded.map((item) => item.trim()).filter(Boolean),
      process: formData.process.map((item) => item.trim()).filter(Boolean),
      bestFor: formData.bestFor,
      cta: formData.cta,
      isActive: formData.isActive,
      order: formData.order,
    };

    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services/subcategories/${editingId}`, payload, {
          headers: headers(),
        });
        toast.success('Sub-category updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/services/subcategories`, payload, {
          headers: headers(),
        });
        toast.success('Sub-category created successfully');
      }
      resetForm();
      fetchSubCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save sub-category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Service Sub-Categories - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-slate-400 text-sm">Manage nested service detail pages</h2>
              <Link to="/admin/services" className="mt-2 inline-flex text-sm text-brand-cyan hover:underline">
                Back to Categories
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...emptyForm, category: categories[0]?.id || '' });
                setEditingId('');
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-2"
              data-testid="new-service-subcategory-btn"
            >
              <Plus size={18} />
              Add New Sub-Category
            </button>
          </div>

          <div className="max-w-sm">
            <label className="block text-sm text-slate-400 mb-2">Filter by Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-dark">
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </select>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="card-glass space-y-6" data-testid="service-subcategory-form">
              <div className="flex items-center justify-between">
                <h3 className="font-syne text-xl font-bold text-white">{editingId ? 'Edit Sub-Category' : 'Add Sub-Category'}</h3>
                <button type="button" onClick={resetForm} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title *</label>
                  <input name="title" value={formData.title} onChange={handleChange} required className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="input-dark">
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Hero Headline *</label>
                  <input name="heroHeadline" value={formData.heroHeadline} onChange={handleChange} required className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Hero Subheadline</label>
                  <input name="heroSubheadline" value={formData.heroSubheadline} onChange={handleChange} className="input-dark" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Overview *</label>
                <textarea name="overview" value={formData.overview} onChange={handleChange} required rows={4} className="input-dark resize-none" />
              </div>

              {['whatsIncluded', 'process'].map((field) => (
                <div key={field}>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm text-slate-400">
                      {field === 'whatsIncluded' ? "What's Included" : 'Process Steps'}
                    </label>
                    <button type="button" onClick={() => addListItem(field)} className="text-sm text-brand-cyan hover:underline">
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData[field].map((item, index) => (
                      <div key={`${field}-${index}`} className="flex gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateListItem(field, index, e.target.value)}
                          className="input-dark"
                          placeholder={field === 'whatsIncluded' ? 'Included item' : 'Process step'}
                        />
                        <button type="button" onClick={() => removeListItem(field, index)} className="px-3 rounded-lg bg-red-500/10 text-red-400">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Best For</label>
                  <input name="bestFor" value={formData.bestFor} onChange={handleChange} className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">CTA Text</label>
                  <input name="cta" value={formData.cta} onChange={handleChange} className="input-dark" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Order</label>
                  <input type="number" name="order" value={formData.order} onChange={handleChange} min="1" className="input-dark" />
                </div>
                <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4" />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Sub-Category'}
                </button>
              </div>
            </form>
          )}

          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : subCategories.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No sub-categories yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Title</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Category</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Status</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Order</th>
                      <th className="text-right text-slate-400 text-sm py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map((item, index) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`service-subcategory-row-${index}`}>
                        <td className="py-4 px-6 text-white font-medium">{item.title}</td>
                        <td className="py-4 px-6 text-slate-300">{item.category?.title || '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{item.order}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-lg" title="Edit">
                              <Edit size={18} className="text-brand-cyan" />
                            </button>
                            <button type="button" onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 rounded-lg" title="Delete">
                              <Trash2 size={18} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminServiceSubCategories;
