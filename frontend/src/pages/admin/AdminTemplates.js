import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { resolveImageUrl } from '../../utils/imageUrl';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('apixel_token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/templates?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store item?')) return;

    try {
      const token = localStorage.getItem('apixel_token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Store item deleted successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete store item');
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Store Management - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search store items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark pl-12 w-full"
                data-testid="template-search-input"
              />
            </div>
            <Link
              to="/admin/templates/new"
              className="btn-primary flex items-center gap-2"
              data-testid="new-template-btn"
            >
              <Plus size={18} />
              New Store Item
            </Link>
          </div>

          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {searchTerm ? 'No store items found matching your search.' : 'No store items yet. Create your first one!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Title</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Category</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Price</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Date</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Status</th>
                      <th className="text-right text-slate-400 text-sm font-dm-sans py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template, index) => (
                      <tr key={template.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`template-row-${index}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {template.thumbnailUrl && (
                              <img
                                src={resolveImageUrl(template.thumbnailUrl)}
                                alt={template.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-white font-medium line-clamp-1">{template.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{template.category}</td>
                        <td className="py-4 px-6 text-brand-gold">{template.priceLabel || '-'}</td>
                        <td className="py-4 px-6 text-slate-400 text-sm">{formatDate(template.createdAt)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            template.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {template.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/templates/${template.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} className="text-slate-400" />
                            </a>
                            <Link
                              to={`/admin/templates/edit/${template.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                              data-testid={`edit-template-${index}`}
                            >
                              <Edit size={18} className="text-brand-cyan" />
                            </Link>
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              data-testid={`delete-template-${index}`}
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

export default AdminTemplates;
