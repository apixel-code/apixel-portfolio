import axios from 'axios';
import { CheckCircle, Download, Eye, FileText, Mail, Phone, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const EXPORT_COLUMNS = [
  { label: 'Date (BD Time)', key: 'createdAt', xmlTag: 'date_bd_time' },
  { label: 'Name', key: 'name', xmlTag: 'name' },
  { label: 'Email', key: 'email', xmlTag: 'email' },
  { label: 'Phone', key: 'phone', xmlTag: 'phone' },
  { label: 'Service', key: 'service', xmlTag: 'service' },
  { label: 'Message', key: 'message', xmlTag: 'message' },
  { label: 'Status', key: 'read', xmlTag: 'status' },
];

const formatExportDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
};

const getMessageField = (message, key) => {
  if (key === 'createdAt') return formatExportDate(message.createdAt);
  if (key === 'read') return message.read ? 'Read' : 'Unread';
  return message[key] || '';
};

const escapeCsvValue = (value) => {
  const stringValue = String(value).replace(/\r?\n/g, ' ');
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const escapeXmlValue = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const downloadFile = ({ content, fileName, mimeType }) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getExportFileDate = () => formatExportDate(new Date()).slice(0, 10);

const getMessageDateKey = (message) => formatExportDate(message.createdAt).slice(0, 10);

const getMessageService = (message) => message.service || 'Not selected';

const getServiceSlug = (service) => service.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportService, setExportService] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('apixel_token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
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
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contact/${id}/read`, {}, {
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/contact/${id}`, {
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

  const getExportMessages = () => {
    return messages.filter((message) => {
      const messageDate = getMessageDateKey(message);
      const matchesStartDate = !exportStartDate || messageDate >= exportStartDate;
      const matchesEndDate = !exportEndDate || messageDate <= exportEndDate;
      const matchesService = !exportService || getMessageService(message) === exportService;

      return matchesStartDate && matchesEndDate && matchesService;
    });
  };

  const hasDateRangeError = exportStartDate && exportEndDate && exportStartDate > exportEndDate;
  const hasActiveFilters = exportStartDate || exportEndDate || exportService;
  const getFilterLabel = () => {
    if (exportStartDate && exportEndDate) return `${exportStartDate}-to-${exportEndDate}`;
    if (exportStartDate) return `from-${exportStartDate}`;
    if (exportEndDate) return `until-${exportEndDate}`;
    return getExportFileDate();
  };

  const handleDownloadCsv = () => {
    if (hasDateRangeError) {
      toast.error('From date cannot be after To date');
      return;
    }

    const exportMessages = getExportMessages();

    if (exportMessages.length === 0) {
      toast.error(hasActiveFilters ? 'No messages found for the selected filters' : 'No messages available to download');
      return;
    }

    const header = EXPORT_COLUMNS.map((column) => escapeCsvValue(column.label)).join(',');
    const rows = exportMessages.map((message) => (
      EXPORT_COLUMNS.map((column) => escapeCsvValue(getMessageField(message, column.key))).join(',')
    ));

    downloadFile({
      content: [header, ...rows].join('\n'),
      fileName: `apixel-contact-messages-${getFilterLabel()}${exportService ? `-${getServiceSlug(exportService)}` : ''}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
    });
  };

  const handleDownloadXml = () => {
    if (hasDateRangeError) {
      toast.error('From date cannot be after To date');
      return;
    }

    const exportMessages = getExportMessages();

    if (exportMessages.length === 0) {
      toast.error(hasActiveFilters ? 'No messages found for the selected filters' : 'No messages available to download');
      return;
    }

    const rows = exportMessages.map((message) => {
      const fields = EXPORT_COLUMNS.map((column) => {
        return `    <${column.xmlTag}>${escapeXmlValue(getMessageField(message, column.key))}</${column.xmlTag}>`;
      }).join('\n');

      return `  <message>\n${fields}\n  </message>`;
    }).join('\n');

    downloadFile({
      content: `<?xml version="1.0" encoding="UTF-8"?>\n<messages exported_at="${new Date().toISOString()}"${exportStartDate ? ` filtered_from_date="${exportStartDate}"` : ''}${exportEndDate ? ` filtered_to_date="${exportEndDate}"` : ''}${exportService ? ` filtered_service="${escapeXmlValue(exportService)}"` : ''}>\n${rows}\n</messages>\n`,
      fileName: `apixel-contact-messages-${getFilterLabel()}${exportService ? `-${getServiceSlug(exportService)}` : ''}.xml`,
      mimeType: 'application/xml;charset=utf-8;',
    });
  };

  const exportMessageCount = hasDateRangeError ? 0 : getExportMessages().length;
  const serviceOptions = [...new Set(messages.map(getMessageService))].sort();

  return (
    <>
      <Helmet>
        <title>Messages - Apixel Admin</title>
      </Helmet>

      <AdminLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 card-glass overflow-hidden">
            <div className="border-b border-white/5 p-4">
              <div className="mb-4">
                <h2 className="font-syne font-semibold text-lg text-white">Contact Messages</h2>
                <p className="text-slate-400 text-sm">{messages.length} total messages</p>
              </div>

              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-col gap-1 text-xs text-slate-500">
                  From
                  <input
                    type="date"
                    value={exportStartDate}
                    onChange={(event) => setExportStartDate(event.target.value)}
                    className="input-dark admin-date-input h-10 px-3 py-0 text-sm"
                    data-testid="messages-export-start-date-input"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-500">
                  To
                  <input
                    type="date"
                    value={exportEndDate}
                    onChange={(event) => setExportEndDate(event.target.value)}
                    className="input-dark admin-date-input h-10 px-3 py-0 text-sm"
                    data-testid="messages-export-end-date-input"
                  />
                </label>
                <select
                  value={exportService}
                  onChange={(event) => setExportService(event.target.value)}
                  className="input-dark h-10 min-w-[190px] px-3 py-0 text-sm"
                  data-testid="messages-export-service-select"
                >
                  <option value="">All services</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setExportStartDate('');
                      setExportEndDate('');
                      setExportService('');
                    }}
                    className="h-10 rounded-lg bg-white/5 px-3 text-sm text-slate-300 transition-colors hover:bg-white/10"
                    data-testid="messages-export-clear-filters-btn"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={loading || hasDateRangeError || exportMessageCount === 0}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-purple px-4 text-sm font-medium text-white transition-colors hover:bg-brand-purple/80 disabled:cursor-not-allowed disabled:opacity-50"
                  data-testid="download-messages-csv-btn"
                >
                  <Download size={16} />
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={handleDownloadXml}
                  disabled={loading || hasDateRangeError || exportMessageCount === 0}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                  data-testid="download-messages-xml-btn"
                >
                  <FileText size={16} />
                  XML
                </button>
                <p className={`pb-2 text-xs ${hasDateRangeError ? 'text-red-400' : 'text-slate-500'}`}>
                  {hasDateRangeError
                    ? 'From date must be before To date'
                    : hasActiveFilters
                    ? `${exportMessageCount} matching messages`
                    : 'All dates and services'}
                </p>
              </div>
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
