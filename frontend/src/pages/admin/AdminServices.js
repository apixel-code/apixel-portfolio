import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Edit, Layers3, Plus, Save, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const emptyForm = {
  title: '',
  description: '',
  icon: 'Code',
  order: 1,
  isActive: true,
};

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = useCallback(() => ({ Authorization: `Bearer ${localStorage.getItem('apixel_token')}` }), []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services/admin/categories`, {
        headers: headers(),
      });
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load service categories');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData(emptyForm);
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

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      title: category.title || '',
      description: category.description || '',
      icon: category.icon || 'Code',
      order: category.order || 1,
      isActive: category.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category and its sub-categories?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/services/categories/${id}`, {
        headers: headers(),
      });
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services/categories/${editingId}`, formData, {
          headers: headers(),
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/services/categories`, formData, {
          headers: headers(),
        });
        toast.success('Category created successfully');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Service Categories - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-slate-400 text-sm">Manage service categories and nested service pages</h2>
              <Link to="/admin/services/subcategories" className="mt-2 inline-flex items-center gap-2 text-sm text-brand-cyan hover:underline">
                <Layers3 size={15} />
                Manage Sub-Categories
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData(emptyForm);
                setEditingId('');
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-2"
              data-testid="new-service-category-btn"
            >
              <Plus size={18} />
              Add New Category
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="card-glass space-y-6" data-testid="service-category-form">
              <div className="flex items-center justify-between">
                <h3 className="font-syne text-xl font-bold text-white">{editingId ? 'Edit Category' : 'Add Category'}</h3>
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
                  <label className="block text-sm text-slate-400 mb-2">Icon</label>
                  <input name="icon" value={formData.icon} onChange={handleChange} className="input-dark" placeholder="Code, FaCode, Palette..." />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-dark resize-none" />
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          )}

          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No categories yet. Create your first one.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Title</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Slug</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Status</th>
                      <th className="text-left text-slate-400 text-sm py-4 px-6">Order</th>
                      <th className="text-right text-slate-400 text-sm py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`service-category-row-${index}`}>
                        <td className="py-4 px-6 text-white font-medium">{category.title}</td>
                        <td className="py-4 px-6 text-slate-300">{category.slug}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${category.isActive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{category.order}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => handleEdit(category)} className="p-2 hover:bg-white/10 rounded-lg" title="Edit">
                              <Edit size={18} className="text-brand-cyan" />
                            </button>
                            <button type="button" onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-500/20 rounded-lg" title="Delete">
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

export default AdminServices;
