import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { resolveImageUrl } from '../../utils/imageUrl';

const emptyForm = {
  name: '',
  role: '',
  image: '',
  order: 1,
  published: true,
};

const AdminExpertForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchExpert = async () => {
        try {
          const token = localStorage.getItem('apixel_token');
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/experts?published_only=false`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const expert = response.data.find((item) => item.id === id);
          if (expert) {
            setFormData({
              name: expert.name || '',
              role: expert.role || '',
              image: expert.image || '',
              order: expert.order ?? 1,
              published: expert.published ?? true,
            });
          }
        } catch (error) {
          toast.error('Failed to fetch expert');
          navigate('/admin/experts');
        } finally {
          setFetching(false);
        }
      };
      fetchExpert();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('apixel_token');
      const headers = { Authorization: `Bearer ${token}` };

      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/experts/${id}`, formData, { headers });
        toast.success('Expert updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/experts`, formData, { headers });
        toast.success('Expert created successfully');
      }

      navigate('/admin/experts');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save expert');
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
        <title>{isEdit ? 'Edit Expert' : 'New Expert'} - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/admin/experts')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <h1 className="font-syne font-bold text-2xl text-white">
              {isEdit ? 'Edit Expert' : 'New Expert'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="expert-form">
            <div className="card-glass space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="e.g., Mahabub Islam"
                  data-testid="expert-name-input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Role *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="e.g., Founder & CEO"
                  data-testid="expert-role-input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="Google Drive link, Drive file ID, or direct image URL"
                  data-testid="expert-image-input"
                />
                {formData.image && (
                  <img
                    src={resolveImageUrl(formData.image)}
                    alt="Expert preview"
                    className="mt-3 h-28 w-28 rounded-full object-cover border border-white/10"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="1"
                  className="input-dark"
                  data-testid="expert-order-input"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-purple focus:ring-brand-purple"
                  data-testid="expert-published-checkbox"
                />
                <label htmlFor="published" className="text-white">Publish this expert on the About page</label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/experts')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                data-testid="expert-submit-btn"
              >
                <Save size={18} />
                {loading ? 'Saving...' : (isEdit ? 'Update Expert' : 'Create Expert')}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminExpertForm;
