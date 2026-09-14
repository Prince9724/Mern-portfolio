import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Eye, Check, Trash2, Search, Mail, MailCheck, Terminal, Inbox, Circle, ArrowUpRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/admin/messages');
      setMessages(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again to view messages');
      } else {
        toast.error('Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}`, { isRead: true });
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true, status: 'read' } : m));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true, status: 'read' });
      }
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
                          m.email?.toLowerCase().includes(search.toLowerCase()) ||
                          m.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'unread' && !m.isRead) ||
                          (filter === 'read' && m.isRead);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
          <p className="text-ink-400 text-sm font-mono">loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-mono tracking-wider">~/admin/inbox</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            <span className="text-white">Message</span>{' '}
            <span className="gradient-text">Inbox</span>
          </h1>
          <p className="text-ink-400 mt-1">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>

        {/* Stats Badge */}
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-mono">
              {unreadCount} new message{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-ink-800/40 border border-ink-700/30 rounded-xl text-white placeholder-ink-500 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-800/60 transition-all font-mono text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: '// all', count: messages.length },
            { key: 'unread', label: '// unread', count: unreadCount },
            { key: 'read', label: '// read', count: messages.length - unreadCount },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                filter === f.key
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-ink-400 border border-ink-700/30 hover:text-white hover:bg-ink-800/50 hover:border-ink-600/50'
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                filter === f.key ? 'bg-emerald-500/20' : 'bg-ink-900/60'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inbox List */}
        <div className="lg:col-span-2 rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          {/* List Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Inbox className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">inbox.list</span>
            <span className="ml-auto text-ink-500 text-xs font-mono">
              {filteredMessages.length} items
            </span>
          </div>

          {/* List Items */}
          <div className="divide-y divide-ink-700/30 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group p-4 cursor-pointer transition-all ${
                  selectedMessage?._id === msg._id 
                    ? 'bg-emerald-500/5 border-l-2 border-emerald-500' 
                    : !msg.isRead 
                      ? 'border-l-2 border-amber-500/50 hover:bg-ink-900/40' 
                      : 'border-l-2 border-transparent hover:bg-ink-900/40'
                }`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${
                    !msg.isRead 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-ink-900/60 border-ink-700/40'
                  }`}>
                    <span className={`text-sm font-mono font-semibold ${
                      !msg.isRead ? 'text-emerald-400' : 'text-ink-400'
                    }`}>
                      {msg.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium truncate text-sm ${
                        !msg.isRead ? 'text-white' : 'text-ink-300'
                      }`}>
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <p className={`text-xs truncate mb-1 ${
                      !msg.isRead ? 'text-ink-300' : 'text-ink-500'
                    }`}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-ink-600 text-[11px] font-mono">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-ink-700 text-[11px] font-mono">·</span>
                      <span className="text-ink-600 text-[11px] font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!msg.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(msg._id); }}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-ink-500 hover:text-emerald-400 transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-ink-500 hover:text-rose-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ink-900/60 border border-ink-700/40 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-ink-600" />
                </div>
                <p className="text-ink-400 text-sm font-mono mb-1">no messages found</p>
                <p className="text-ink-600 text-xs font-mono">
                  {search ? 'try a different search' : 'inbox is empty'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden"
              >
                {/* Detail Header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="ml-2 text-ink-400 text-xs font-mono">
                    message-{selectedMessage._id.slice(-6)}.txt
                  </span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-mono ${
                    selectedMessage.isRead 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}>
                    {selectedMessage.isRead ? 'read' : 'unread'}
                  </span>
                </div>

                {/* Detail Content */}
                <div className="p-6 space-y-6">
                  {/* From */}
                  <div>
                    <div className="flex items-center gap-2 text-ink-500 text-xs font-mono uppercase tracking-wider mb-3">
                      <span className="text-emerald-400">//</span>
                      <span>from</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-lg font-mono font-semibold">
                          {selectedMessage.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedMessage.name}</p>
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="text-emerald-400 hover:text-emerald-300 text-sm font-mono transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <div className="flex items-center gap-2 text-ink-500 text-xs font-mono uppercase tracking-wider mb-3">
                      <span className="text-emerald-400">//</span>
                      <span>subject</span>
                    </div>
                    <p className="text-white font-medium text-lg">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center gap-2 text-ink-500 text-xs font-mono uppercase tracking-wider mb-3">
                      <span className="text-emerald-400">//</span>
                      <span>message</span>
                    </div>
                    <div className="relative p-5 rounded-xl bg-ink-900/60 border border-ink-700/30">
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                      </div>
                      <p className="text-ink-200 whitespace-pre-wrap leading-relaxed pl-4">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-ink-500 text-xs font-mono pt-4 border-t border-ink-700/30">
                    <Clock className="w-3 h-3" />
                    <span>Received</span>
                    <span className="text-ink-400">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {!selectedMessage.isRead && (
                      <button
                        onClick={() => markAsRead(selectedMessage._id)}
                        className="group flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald"
                      >
                        <MailCheck className="w-4 h-4" />
                        Mark as Read
                      </button>
                    )}
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400 text-sm font-medium transition-all"
                    >
                      Reply
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-rose-500/40 hover:bg-rose-500/5 text-ink-200 hover:text-rose-400 text-sm font-medium transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-ink-800/40 border border-ink-700/30 flex items-center justify-center min-h-[500px]"
              >
                <div className="text-center px-8">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-ink-900/60 border border-ink-700/40 flex items-center justify-center">
                    <Mail className="w-9 h-9 text-ink-600" />
                  </div>
                  <p className="text-ink-300 font-medium mb-2">No message selected</p>
                  <p className="text-ink-500 text-sm font-mono">
                    Select a message from the inbox to view details
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Messages;