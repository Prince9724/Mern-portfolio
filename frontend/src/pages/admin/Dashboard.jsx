import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import { api } from '../../services/api';
import {
  FolderGit2,
  Code2,
  Mail,
  Clock,
  PlusCircle,
  Settings,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/admin/messages'),
        ]);

        const messages = messagesRes.data?.data || [];
        const unreadCount = messages.filter(m => !m.isRead).length;

        setStats({
          projects: projectsRes.data?.count || 0,
          skills: skillsRes.data?.count || 0,
          messages: messages.length,
          unreadMessages: unreadCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        try {
          const [projectsRes, skillsRes] = await Promise.all([
            api.get('/projects'),
            api.get('/skills'),
          ]);
          setStats(prev => ({
            ...prev,
            projects: projectsRes.data?.count || 0,
            skills: skillsRes.data?.count || 0,
          }));
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FolderGit2, label: 'Projects', value: stats.projects, color: 'text-purple-500' },
    { icon: Code2, label: 'Skills', value: stats.skills, color: 'text-blue-500' },
    { icon: Mail, label: 'Messages', value: stats.messages, color: 'text-green-500' },
    { icon: Clock, label: 'Unread', value: stats.unreadMessages, color: 'text-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your portfolio admin panel!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-10 h-10 ${card.color} opacity-50`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ✅ Use Link instead of <a> */}
        <Link
          to="/admin/projects/new"
          className="glass rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 text-center group cursor-pointer"
        >
          <PlusCircle className="w-10 h-10 text-purple-400 mx-auto mb-3 group-hover:rotate-90 transition-transform" />
          <h4 className="text-white font-medium">Add Project</h4>
          <p className="text-gray-400 text-sm">Create a new project</p>
        </Link>
        
        <Link
          to="/admin/skills"
          className="glass rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 text-center group cursor-pointer"
        >
          <Code2 className="w-10 h-10 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="text-white font-medium">Manage Skills</h4>
          <p className="text-gray-400 text-sm">Add or edit skills</p>
        </Link>
        
        <Link
          to="/admin/settings"
          className="glass rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 text-center group cursor-pointer"
        >
          <Settings className="w-10 h-10 text-yellow-400 mx-auto mb-3 group-hover:rotate-90 transition-transform" />
          <h4 className="text-white font-medium">Site Settings</h4>
          <p className="text-gray-400 text-sm">Update portfolio content</p>
        </Link>
        
        <Link
          to="/admin/profile"
          className="glass rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 text-center group cursor-pointer"
        >
          <User className="w-10 h-10 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="text-white font-medium">Profile</h4>
          <p className="text-gray-400 text-sm">Update your account</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;