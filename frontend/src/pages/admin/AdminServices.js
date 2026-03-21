import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('apixel_token');
      await axios.delete(`${API_URL}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  return (
    <>
      <Helmet>
        <title>Service Management - APIXEL Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-slate-400 text-sm">Manage your agency services</h2>
            <Link
              to="/admin/services/new"
              className="btn-primary flex items-center gap-2"
              data-testid="new-service-btn"
            >
              <Plus size={18} />
              New Service
            </Link>
          </div>

          {/* Table */}
          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No services yet. Create your first service!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6 w-12">Order</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Service Name</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Price Range</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Features</th>
                      <th className="text-right text-slate-400 text-sm font-dm-sans py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={service.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`service-row-${index}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-slate-500">
                            <GripVertical size={16} />
                            <span>{service.order}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{service.icon}</span>
                            <span className="text-white font-medium">{service.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-brand-gold">{service.priceRange}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400">
                                +{service.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/services/edit/${service.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                              data-testid={`edit-service-${index}`}
                            >
                              <Edit size={18} className="text-brand-cyan" />
                            </Link>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              data-testid={`delete-service-${index}`}
                            >
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
