import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Mail, Phone, CheckCircle, XCircle, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('apixel_token');
      const response = await axios.get(`${API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem('apixel_token');
      await axios.put(`${API_URL}/api/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('apixel_token');
      await axios.delete(`${API_URL}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Message deleted');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Messages - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 card-glass overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-syne font-semibold text-lg text-white">Contact Messages</h2>
              <p className="text-slate-400 text-sm">{messages.length} total messages</p>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No messages yet</div>
            ) : (
              <div className="divide-y divide-white/5">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) handleMarkRead(message.id);
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-brand-purple/20' : 'hover:bg-white/5'
                    } ${!message.read ? 'border-l-2 border-brand-cyan' : ''}`}
                    data-testid={`message-item-${index}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white truncate">{message.name}</span>
                          {!message.read && (
                            <span className="w-2 h-2 bg-brand-cyan rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 truncate">{message.email}</p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{message.message}</p>
                      </div>
                      <div className="text-xs text-slate-500 flex-shrink-0">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="card-glass h-fit lg:sticky lg:top-24">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-syne font-semibold text-lg text-white">Message Details</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedMessage.read ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedMessage.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Name</label>
                    <p className="text-white">{selectedMessage.name}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-brand-cyan" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-white hover:text-brand-cyan">
                      {selectedMessage.email}
                    </a>
                  </div>

                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-brand-cyan" />
                      <a href={`tel:${selectedMessage.phone}`} className="text-white hover:text-brand-cyan">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}

                  {selectedMessage.service && (
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider">Service Interested</label>
                      <p className="text-brand-gold">{selectedMessage.service}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Message</label>
                    <p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Received</label>
                    <p className="text-slate-400 text-sm">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/5">
                  {!selectedMessage.read && (
                    <button
                      onClick={() => handleMarkRead(selectedMessage.id)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2"
                      data-testid="mark-read-btn"
                    >
                      <CheckCircle size={16} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    data-testid="delete-message-btn"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Eye size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminMessages;
