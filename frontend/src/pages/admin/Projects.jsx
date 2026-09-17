import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Search, 
  Terminal, 
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects/admin/all');
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await api.put(`/projects/${id}`, { status: newStatus });
      setProjects(projects.map(p => 
        p._id === id ? { ...p, status: newStatus } : p
      ));
      toast.success(`Project ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      await api.put(`/projects/${id}`, { featured: !currentFeatured });
      setProjects(projects.map(p => 
        p._id === id ? { ...p, featured: !currentFeatured } : p
      ));
      toast.success('Featured status updated');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                          p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    featured: projects.filter(p => p.featured).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
          <p className="text-ink-400 text-sm font-mono">loading projects...</p>
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
            <span className="text-emerald-400 text-sm font-mono tracking-wider">~/admin/projects</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            <span className="text-white">Portfolio</span>{' '}
            <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-ink-400 mt-1">
            {stats.total} total · {stats.published} published · {stats.draft} drafts
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald whitespace-nowrap"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: FolderGit2, accent: 'emerald' },
          { label: 'Published', value: stats.published, icon: CheckCircle2, accent: 'teal' },
          { label: 'Drafts', value: stats.draft, icon: AlertCircle, accent: 'amber' },
          { label: 'Featured', value: stats.featured, icon: Star, accent: 'rose' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group p-4 rounded-xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 text-${stat.accent}-400`} />
              <span className="text-2xl font-bold text-white font-mono">
                {String(stat.value).padStart(2, '0')}
              </span>
            </div>
            <p className="text-ink-400 text-xs font-mono uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-ink-800/40 border border-ink-700/30 rounded-xl text-white placeholder-ink-500 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-800/60 transition-all font-mono text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: '// all', count: stats.total },
            { key: 'published', label: '// live', count: stats.published },
            { key: 'draft', label: '// draft', count: stats.draft },
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

      {/* Projects Table */}
      <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
        {/* Table Header Bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 text-ink-400 text-xs font-mono">projects.list</span>
          <span className="ml-auto text-ink-500 text-xs font-mono">
            {filteredProjects.length} of {projects.length} items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-ink-700/30">
              <tr className="text-left">
                <th className="px-5 py-3 text-xs font-mono text-ink-500 uppercase tracking-wider">
                  <span className="text-emerald-400">//</span> project
                </th>
                <th className="px-5 py-3 text-xs font-mono text-ink-500 uppercase tracking-wider hidden md:table-cell">
                  <span className="text-emerald-400">//</span> category
                </th>
                <th className="px-5 py-3 text-xs font-mono text-ink-500 uppercase tracking-wider hidden lg:table-cell">
                  <span className="text-emerald-400">//</span> status
                </th>
                <th className="px-5 py-3 text-xs font-mono text-ink-500 uppercase tracking-wider text-center">
                  <span className="text-emerald-400">//</span> featured
                </th>
                <th className="px-5 py-3 text-xs font-mono text-ink-500 uppercase tracking-wider text-right">
                  <span className="text-emerald-400">//</span> actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-ink-700/20 last:border-0 hover:bg-ink-900/40 transition-colors group"
                  >
                    {/* Project */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {project.thumbnail ? (
                          <div className="relative flex-shrink-0">
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-14 h-14 rounded-xl object-cover border border-ink-700/40"
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/100/0B0F14/10B981?text=?';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-ink-900/60 border border-ink-700/40 flex items-center justify-center flex-shrink-0">
                            <FolderGit2 className="w-5 h-5 text-ink-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[200px] group-hover:text-emerald-400 transition-colors">
                            {project.title}
                          </p>
                          <p className="text-ink-500 text-xs truncate max-w-[240px] font-mono">
                            {project.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-ink-900/60 border border-ink-700/40 text-xs text-ink-300 font-mono whitespace-nowrap">
                        {project.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {project.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          draft
                        </span>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleFeatured(project._id, project.featured)}
                        className={`p-1.5 rounded-lg transition-all ${
                          project.featured 
                            ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' 
                            : 'text-ink-600 hover:text-ink-400 hover:bg-ink-900/60'
                        }`}
                        title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatus(project._id, project.status)}
                          className={`p-2 rounded-lg transition-all ${
                            project.status === 'published'
                              ? 'text-ink-500 hover:text-amber-400 hover:bg-amber-500/10'
                              : 'text-ink-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                          title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {project.status === 'published' 
                            ? <EyeOff className="w-4 h-4" /> 
                            : <Eye className="w-4 h-4" />
                          }
                        </button>
                        <Link
                          to={`/admin/projects/${project._id}/edit`}
                          className="p-2 rounded-lg text-ink-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ink-900/60 border border-ink-700/40 flex items-center justify-center">
              <FolderGit2 className="w-7 h-7 text-ink-600" />
            </div>
            <p className="text-ink-300 font-medium mb-1">
              {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
            </p>
            <p className="text-ink-500 text-sm font-mono mb-4">
              {projects.length === 0 
                ? 'Create your first project to get started' 
                : `No results for "${search}" or the selected filter`}
            </p>
            {projects.length === 0 && (
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </Link>
            )}
          </div>
        )}

        {/* Footer Stats */}
        {filteredProjects.length > 0 && (
          <div className="px-5 py-3 border-t border-ink-700/30 bg-ink-900/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-ink-500 text-xs font-mono">
                showing {filteredProjects.length} of {projects.length}
              </span>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-mono underline underline-offset-2"
                >
                  clear filter
                </button>
              )}
            </div>
            <span className="text-ink-600 text-xs font-mono">admin.projects</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;