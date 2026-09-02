import { useState, useEffect } from 'react';
import { api } from '../../services/api'; // ✅ publicApi ki jagah api
import { Eye, Check, Trash2, Search, Mail, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      console.log('📊 Fetching messages...');
      const { data } = await api.get('/admin/messages'); // ✅ api use karein
      console.log('✅ Messages fetched:', data.data?.length || 0);
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
      await api.put(`/admin/messages/${id}`, { isRead: true }); // ✅ api use karein
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true, status: 'read' } : m));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`); // ✅ api use karein
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

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-gray-400">View and manage contact form messages</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl border border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5">
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                  !msg.isRead ? 'border-l-2 border-purple-500' : ''
                } ${selectedMessage?._id === msg._id ? 'bg-white/5' : ''}`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{msg.name}</span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-sm truncate">{msg.subject}</p>
                    <p className="text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {!msg.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(msg._id); }}
                        className="p-1.5 rounded hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                No messages found
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/5">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Message Details</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedMessage.isRead ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedMessage.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">From</p>
                <p className="text-white font-medium">{selectedMessage.name}</p>
                <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Subject</p>
                <p className="text-white">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Message</p>
                <p className="text-gray-300 whitespace-pre-wrap bg-white/5 rounded-lg p-3 text-sm">
                  {selectedMessage.message}
                </p>
              </div>
              <p className="text-gray-500 text-xs">
                Received {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-2 pt-2">
                {!selectedMessage.isRead && (
                  <button
                    onClick={() => markAsRead(selectedMessage._id)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <MailCheck className="w-4 h-4 inline mr-2" /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="px-4 py-2 glass hover:glass-dark text-red-400 rounded-lg transition-colors text-sm border border-white/10"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;