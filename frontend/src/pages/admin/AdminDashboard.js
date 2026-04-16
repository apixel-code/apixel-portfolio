import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, FileText, LayoutTemplate, MessageSquare, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalServices: 0,
    totalTemplates: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('apixel_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [statsRes, messagesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stats`, { headers }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, { headers }),
        ]);
        
        setStats(statsRes.data);
        setRecentMessages(messagesRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: 'purple' },
    { title: 'Total Services', value: stats.totalServices, icon: Briefcase, color: 'cyan' },
    { title: 'Total Store Items', value: stats.totalTemplates, icon: LayoutTemplate, color: 'gold' },
    { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'gold' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: Users, color: 'red' },
  ];

  const quickActions = [
    { title: 'New Blog', path: '/admin/blogs/new', icon: FileText },
    { title: 'New Service', path: '/admin/services/new', icon: Briefcase },
    { title: 'New Store Item', path: '/admin/templates/new', icon: LayoutTemplate },
    { title: 'View Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-glass"
                  data-testid={`stat-card-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.title}</p>
                      <p className="font-syne font-bold text-3xl text-white mt-2">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'purple' ? 'bg-brand-purple/20' :
                      stat.color === 'cyan' ? 'bg-brand-cyan/20' :
                      stat.color === 'gold' ? 'bg-brand-gold/20' :
                      'bg-red-500/20'
                    }`}>
                      <Icon size={24} className={
                        stat.color === 'purple' ? 'text-brand-purple' :
                        stat.color === 'cyan' ? 'text-brand-cyan' :
                        stat.color === 'gold' ? 'text-brand-gold' :
                        'text-red-500'
                      } />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="card-glass">
            <h2 className="font-syne font-semibold text-lg text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.path}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-purple/20 text-brand-purple rounded-lg hover:bg-brand-purple/30 transition-colors"
                    data-testid={`quick-action-${action.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon size={18} />
                    {action.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="card-glass">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-semibold text-lg text-white">Recent Messages</h2>
              <Link
                to="/admin/messages"
                className="text-brand-cyan text-sm hover:underline flex items-center gap-1"
              >
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : recentMessages.length === 0 ? (
              <p className="text-slate-400">No messages yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-3 px-4">Name</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-3 px-4">Email</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-3 px-4">Service</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-3 px-4">Date</th>
                      <th className="text-left text-slate-400 text-sm font-dm-sans py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMessages.map((message, index) => (
                      <tr key={message.id} className="border-b border-white/5" data-testid={`message-row-${index}`}>
                        <td className="py-3 px-4 text-white">{message.name}</td>
                        <td className="py-3 px-4 text-slate-300">{message.email}</td>
                        <td className="py-3 px-4 text-slate-300">{message.service || '-'}</td>
                        <td className="py-3 px-4 text-slate-400 text-sm">{formatDate(message.createdAt)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.read ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {message.read ? 'Read' : 'Unread'}
                          </span>
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

export default AdminDashboard;
