import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    icon: 'Code',
    priceRange: '',
    order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const iconOptions = ['Code', 'Target', 'Share2', 'Palette'];

  useEffect(() => {
    if (isEdit) {
      const fetchService = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/services`);
          const service = response.data.find(s => s.id === id);
          if (service) {
            setFormData({
              ...service,
              features: service.features ? service.features.join(', ') : '',
            });
          }
        } catch (error) {
          toast.error('Failed to fetch service');
          navigate('/admin/services');
        } finally {
          setFetching(false);
        }
      };
      fetchService();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
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
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
      };

      if (isEdit) {
        await axios.put(`${API_URL}/api/services/${id}`, data, { headers });
        toast.success('Service updated successfully');
      } else {
        await axios.post(`${API_URL}/api/services`, data, { headers });
        toast.success('Service created successfully');
      }
      
      navigate('/admin/services');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save service');
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
        <title>{isEdit ? 'Edit Service' : 'New Service'} - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/admin/services')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <h1 className="font-syne font-bold text-2xl text-white">
              {isEdit ? 'Edit Service' : 'New Service'}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="service-form">
            <div className="card-glass space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="e.g., Website Development (MERN)"
                  data-testid="service-name-input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-dark resize-none"
                  placeholder="Describe the service..."
                  data-testid="service-description-input"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Features (comma-separated) *</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Custom React Frontend, Node.js Backend, MongoDB Database"
                  data-testid="service-features-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icon */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="input-dark"
                    data-testid="service-icon-select"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="1"
                    className="input-dark"
                    data-testid="service-order-input"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Price Range *</label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="e.g., $2,000 - $15,000"
                  data-testid="service-price-input"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/services')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                data-testid="service-submit-btn"
              >
                <Save size={18} />
                {loading ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminServiceForm;
