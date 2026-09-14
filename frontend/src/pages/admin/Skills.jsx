import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  Terminal, 
  Code2, 
  Database, 
  Server, 
  Wrench, 
  BookOpen,
  X,
  CheckCircle2,
  Hash,
  BarChart3,
  Layers,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 70,
    displayOrder: 0,
  });

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'];

  const categoryIcons = {
    'Frontend': Code2,
    'Backend': Server,
    'Database': Database,
    'Tools': Wrench,
    'Currently Learning': BookOpen,
  };

  const categoryColors = {
    'Frontend': { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    'Backend': { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    'Database': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    'Tools': { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    'Currently Learning': { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  };

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/skills/${editing._id}`, formData);
        toast.success('Skill updated successfully');
      } else {
        await api.post('/skills', formData);
        toast.success('Skill added successfully');
      }
      fetchSkills();
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', category: 'Frontend', level: 70, displayOrder: 0 });
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error(error.response?.data?.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIXED DELETE HANDLER
  const handleDelete = async (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!window.confirm('Delete this skill? This action cannot be undone.')) return;

    setDeleting(id);
    try {
      await api.delete(`/skills/${id}`);
      
      // Update state immediately
      setSkills(prev => prev.filter(s => s._id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete skill');
      // Refresh on error
      fetchSkills();
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || 70,
      displayOrder: skill.displayOrder || 0,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ name: '', category: 'Frontend', level: 70, displayOrder: 0 });
  };

  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.category === filter);

  const stats = {
    total: skills.length,
    avgLevel: skills.length > 0 
      ? Math.round(skills.reduce((sum, s) => sum + (s.level || 70), 0) / skills.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
          <p className="text-ink-400 text-sm font-mono">loading skills...</p>
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
            <span className="text-emerald-400 text-sm font-mono tracking-wider">~/admin/skills</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            <span className="text-white">Tech</span>{' '}
            <span className="gradient-text">Stack</span>
          </h1>
          <p className="text-ink-400 mt-1">
            {stats.total} skills · avg level {stats.avgLevel}%
          </p>
        </div>
        <button
          onClick={() => { 
            setShowForm(true); 
            setEditing(null); 
            setFormData({ name: '', category: 'Frontend', level: 70, displayOrder: 0 }); 
          }}
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald whitespace-nowrap"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Skill
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-ink-800/40 border border-ink-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {String(stats.total).padStart(2, '0')}
            </span>
          </div>
          <p className="text-ink-400 text-xs font-mono uppercase tracking-wider">Total Skills</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-ink-800/40 border border-ink-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {stats.avgLevel}%
            </span>
          </div>
          <p className="text-ink-400 text-xs font-mono uppercase tracking-wider">Avg Level</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-ink-800/40 border border-ink-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {String(categories.length).padStart(2, '0')}
            </span>
          </div>
          <p className="text-ink-400 text-xs font-mono uppercase tracking-wider">Categories</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-ink-800/40 border border-ink-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {String(groupedSkills['Currently Learning']?.length || 0).padStart(2, '0')}
            </span>
          </div>
          <p className="text-ink-400 text-xs font-mono uppercase tracking-wider">Learning</p>
        </motion.div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="ml-2 text-ink-400 text-xs font-mono">
                {editing ? 'edit-skill.sh' : 'new-skill.sh'}
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="ml-auto p-1.5 rounded-lg hover:bg-ink-800/60 text-ink-500 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    <Hash className="w-3 h-3" />
                    <span>// skill name *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                    required
                    placeholder="e.g., React.js"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    <Layers className="w-3 h-3" />
                    <span>// category *</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    <BarChart3 className="w-3 h-3" />
                    <span>// proficiency level (1-100)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm pr-16"
                      min="1"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 text-xs font-mono">
                      %
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1 bg-ink-900/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, formData.level))}%` }}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    <Hash className="w-3 h-3" />
                    <span>// display order</span>
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> {editing ? 'Update' : 'Add'} Skill</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-ink-600/50 text-ink-300 hover:text-white text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-ink-400 border border-ink-700/30 hover:text-white hover:bg-ink-800/50'
          }`}
        >
          <Filter className="w-3 h-3" />
          // all
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
            filter === 'all' ? 'bg-emerald-500/20' : 'bg-ink-900/60'
          }`}>
            {stats.total}
          </span>
        </button>
        {categories.map(cat => {
          const count = groupedSkills[cat]?.length || 0;
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                filter === cat
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-ink-400 border border-ink-700/30 hover:text-white hover:bg-ink-800/50'
              }`}
            >
              <Icon className="w-3 h-3" />
              // {cat.toLowerCase().split(' ')[0]}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                filter === cat ? 'bg-emerald-500/20' : 'bg-ink-900/60'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const Icon = categoryIcons[skill.category] || Code2;
              const colors = categoryColors[skill.category] || categoryColors['Frontend'];
              const isDeleting = deleting === skill._id;

              return (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: isDeleting ? 0.5 : 1, 
                    scale: 1 
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group relative p-4 rounded-xl bg-ink-800/40 border ${colors.border} hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    
                    {/* Action Buttons - Higher z-index */}
                    <div className="flex gap-1 relative z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(skill);
                        }}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(skill._id, e)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Skill Info */}
                  <h4 className="text-white font-medium text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-ink-500 text-xs font-mono">
                    {skill.category}
                  </span>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-ink-500">level</span>
                      <span className={colors.text}>{String(skill.level || 70).padStart(3, '0')}%</span>
                    </div>
                    <div className="w-full h-1 bg-ink-900/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level || 70}%` }}
                        transition={{ duration: 0.8, delay: index * 0.03 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Order Badge - Bottom Right (no overlap with buttons) */}
                  {skill.displayOrder !== undefined && (
                    <div className="absolute bottom-2 right-3 text-[10px] font-mono text-ink-600 group-hover:text-emerald-400 transition-colors pointer-events-none">
                      #{String(skill.displayOrder).padStart(2, '0')}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 py-16 px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ink-900/60 border border-ink-700/40 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-ink-600" />
            </div>
            <p className="text-ink-300 font-medium mb-1">
              {skills.length === 0 ? 'No skills yet' : `No skills in "${filter}"`}
            </p>
            <p className="text-ink-500 text-sm font-mono mb-4">
              {skills.length === 0 
                ? 'Add your first skill to get started' 
                : 'Try selecting a different category'}
            </p>
            {skills.length === 0 && (
              <button
                onClick={() => { 
                  setShowForm(true); 
                  setEditing(null); 
                  setFormData({ name: '', category: 'Frontend', level: 70, displayOrder: 0 }); 
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Summary */}
      {filteredSkills.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-ink-800/30 border border-ink-700/20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-ink-400 text-xs font-mono">
              showing {filteredSkills.length} of {skills.length} skills
            </span>
          </div>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-mono underline underline-offset-2"
            >
              clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;