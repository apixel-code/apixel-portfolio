import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { resolveImageUrl } from '../../utils/imageUrl';

const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem('apixel_token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/experts?published_only=false`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expert?')) return;

    try {
      const token = localStorage.getItem('apixel_token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/experts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Expert deleted successfully');
      fetchExperts();
    } catch (error) {
      toast.error('Failed to delete expert');
    }
  };

  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Experts Management - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search experts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark pl-12 w-full"
                data-testid="expert-search-input"
              />
            </div>
            <Link
              to="/admin/experts/new"
              className="btn-primary flex items-center gap-2"
              data-testid="new-expert-btn"
            >
              <Plus size={18} />
              New Expert
            </Link>
          </div>

          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : filteredExperts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {searchTerm
                  ? 'No experts found matching your search.'
                  : 'No experts yet. Add your first team member!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Name</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Role</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Order</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Status</th>
                      <th className="text-right text-slate-400 text-sm font-dm-sans py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExperts.map((expert, index) => (
                      <tr
                        key={expert.id}
                        className="border-b border-white/5 hover:bg-white/5"
                        data-testid={`expert-row-${index}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {expert.image && (
                              <img
                                src={resolveImageUrl(expert.image)}
                                alt={expert.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <span className="text-white font-medium line-clamp-1">{expert.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{expert.role}</td>
                        <td className="py-4 px-6 text-slate-400">{expert.order}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              expert.published
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {expert.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/experts/edit/${expert.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                              data-testid={`edit-expert-${index}`}
                            >
                              <Edit size={18} className="text-brand-cyan" />
                            </Link>
                            <button
                              onClick={() => handleDelete(expert.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              data-testid={`delete-expert-${index}`}
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

export default AdminExperts;
