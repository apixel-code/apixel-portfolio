import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('apixel_token');
      const response = await axios.get(`${API_URL}/api/blogs?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('apixel_token');
      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <title>Blog Management - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark pl-12 w-full"
                data-testid="blog-search-input"
              />
            </div>
            <Link
              to="/admin/blogs/new"
              className="btn-primary flex items-center gap-2"
              data-testid="new-blog-btn"
            >
              <Plus size={18} />
              New Blog
            </Link>
          </div>

          {/* Table */}
          <div className="card-glass overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : filteredBlogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {searchTerm ? 'No blogs found matching your search.' : 'No blogs yet. Create your first blog!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Title</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Category</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Author</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Date</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-4 px-6">Status</th>
                      <th className="text-right text-slate-400 text-sm font-dm-sans py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog, index) => (
                      <tr key={blog.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`blog-row-${index}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {blog.thumbnailUrl && (
                              <img
                                src={blog.thumbnailUrl}
                                alt={blog.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-white font-medium line-clamp-1">{blog.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{blog.category}</td>
                        <td className="py-4 px-6 text-slate-300">{blog.author}</td>
                        <td className="py-4 px-6 text-slate-400 text-sm">{formatDate(blog.createdAt)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} className="text-slate-400" />
                            </a>
                            <Link
                              to={`/admin/blogs/edit/${blog.id}`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit"
                              data-testid={`edit-blog-${index}`}
                            >
                              <Edit size={18} className="text-brand-cyan" />
                            </Link>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              data-testid={`delete-blog-${index}`}
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

export default AdminBlogs;
