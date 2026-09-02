import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 70,
    displayOrder: 0,
  });

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'];

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

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      fetchSkills();
    } catch (error) {
      toast.error('Failed to delete skill');
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-gray-400">Manage your skills and technologies</p>
        </div>
        <button
          onClick={() => { 
            setShowForm(true); 
            setEditing(null); 
            setFormData({ name: '', category: 'Frontend', level: 70, displayOrder: 0 }); 
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editing ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                  placeholder="e.g., React.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Level (1-100)</label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="0"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Update' : 'Add'} Skill
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-6 py-2 glass hover:glass-dark text-white rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill._id} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
            <div className="flex-1">
              <h4 className="text-white font-medium">{skill.name}</h4>
              <span className="text-xs text-gray-400">{skill.category}</span>
              <div className="mt-1 w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${skill.level || 70}%` }} />
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(skill)} 
                className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(skill._id)} 
                className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No skills added yet. Add your first skill!
        </div>
      )}
    </div>
  );
};

export default Skills;