import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  FolderGit2,
  Code2,
  Mail,
  Clock,
  PlusCircle,
  Settings,
  User,
  Terminal,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

        // Recent messages (top 3)
        setRecentMessages(messages.slice(0, 3));
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
    { 
      icon: FolderGit2, 
      label: 'Projects', 
      value: stats.projects, 
      accent: 'emerald',
      change: '+2 this month'
    },
    { 
      icon: Code2, 
      label: 'Skills', 
      value: stats.skills, 
      accent: 'teal',
      change: 'Total skills'
    },
    { 
      icon: Mail, 
      label: 'Messages', 
      value: stats.messages, 
      accent: 'amber',
      change: 'All time'
    },
    { 
      icon: Clock, 
      label: 'Unread', 
      value: stats.unreadMessages, 
      accent: 'rose',
      change: 'Need attention'
    },
  ];

  const quickActions = [
    {
      icon: PlusCircle,
      title: 'Add Project',
      description: 'Create a new portfolio project',
      path: '/admin/projects/new',
      accent: 'emerald',
    },
    {
      icon: Code2,
      title: 'Manage Skills',
      description: 'Add or edit your tech stack',
      path: '/admin/skills',
      accent: 'teal',
    },
    {
      icon: Settings,
      title: 'Site Settings',
      description: 'Update portfolio content',
      path: '/admin/settings',
      accent: 'amber',
    },
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your account',
      path: '/admin/profile',
      accent: 'violet',
    },
  ];

  const accentColors = {
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/40',
      glow: 'hover:shadow-glow-emerald',
    },
    teal: {
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      hoverBorder: 'hover:border-teal-500/40',
      glow: '',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/40',
      glow: '',
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      hoverBorder: 'hover:border-rose-500/40',
      glow: '',
    },
    violet: {
      text: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      hoverBorder: 'hover:border-violet-500/40',
      glow: '',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
          <p className="text-ink-400 text-sm font-mono">loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Terminal Style */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-mono tracking-wider">~/admin/dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="gradient-text">Prince</span>
          </h1>
          <p className="text-ink-400 mt-1">Here's what's happening with your portfolio</p>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-ink-800/40 border border-ink-700/30">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <p className="text-white text-sm font-mono font-medium">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
            <p className="text-ink-500 text-xs font-mono">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const accent = accentColors[card.accent];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-5 rounded-2xl bg-ink-800/40 border ${accent.border} ${accent.hoverBorder} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${accent.bg} border ${accent.border}`}>
                    <card.icon className={`w-5 h-5 ${accent.text}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-ink-600" />
                </div>
                
                <p className="text-ink-400 text-xs font-mono uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-white font-mono tracking-tight">
                  {String(card.value).padStart(2, '0')}
                </p>
                <p className="text-ink-500 text-xs font-mono mt-2">
                  {card.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-semibold">Quick Actions</h3>
            <span className="text-ink-500 text-xs font-mono">// shortcuts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const accent = accentColors[action.accent];
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <Link
                    to={action.path}
                    className={`group relative block p-5 rounded-2xl bg-ink-800/40 border ${accent.border} ${accent.hoverBorder} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${accent.bg} border ${accent.border} group-hover:scale-110 transition-transform`}>
                          <action.icon className={`w-5 h-5 ${accent.text}`} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{action.title}</h4>
                          <p className="text-ink-400 text-xs">{action.description}</p>
                        </div>
                      </div>
                      <ArrowUpRight className={`w-4 h-4 ${accent.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-semibold">Recent Messages</h3>
          </div>

          <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
            {recentMessages.length > 0 ? (
              <div className="divide-y divide-ink-700/30">
                {recentMessages.map((msg, index) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 hover:bg-ink-900/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-xs font-mono font-semibold">
                          {msg.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white text-sm font-medium truncate">
                            {msg.name}
                          </p>
                          {!msg.isRead && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-ink-500 text-xs truncate">{msg.subject}</p>
                        <p className="text-ink-600 text-xs font-mono mt-1">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Mail className="w-8 h-8 text-ink-600 mx-auto mb-2" />
                <p className="text-ink-500 text-sm font-mono">no messages yet</p>
              </div>
            )}

            {/* View All */}
            <Link
              to="/admin/messages"
              className="block p-3 text-center text-emerald-400 hover:text-emerald-300 text-xs font-mono border-t border-ink-700/30 hover:bg-emerald-500/5 transition-colors"
            >
              view all messages →
            </Link>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-ink-800/30 border border-ink-700/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono">system online</span>
          </div>
          <span className="text-ink-600 text-xs font-mono">|</span>
          <span className="text-ink-500 text-xs font-mono">MongoDB connected</span>
        </div>
        <span className="text-ink-600 text-xs font-mono">v1.0.0</span>
      </div>
    </div>
  );
};

export default Dashboard;