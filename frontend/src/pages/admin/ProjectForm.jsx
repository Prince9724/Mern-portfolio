import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon,
  Terminal,
  FileText,
  Link2,
  Github,
  Globe,
  Star,
  Layers,
  CheckCircle2,
  AlertCircle,
  Code2,
  Lightbulb,
  Target,
  Hash,
  Save
} from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    thumbnail: '',
    screenshots: [],
    technologies: [],
    features: [],
    challenges: '',
    solutions: '',
    githubUrl: '',
    liveUrl: '',
    category: 'Full Stack',
    featured: false,
    status: 'draft',
    displayOrder: 0,
  });
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newScreenshot, setNewScreenshot] = useState('');

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${id}`);
      setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await api.post('/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const imageUrl = response.data.data.url;
      
      if (e.target.name === 'thumbnail') {
        setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
        toast.success('Thumbnail uploaded!');
      } else if (e.target.name === 'screenshot') {
        setFormData(prev => ({
          ...prev,
          screenshots: [...prev.screenshots, imageUrl]
        }));
        toast.success('Screenshot uploaded!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addScreenshot = () => {
    if (newScreenshot.trim() && !formData.screenshots.includes(newScreenshot.trim())) {
      setFormData(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, newScreenshot.trim()]
      }));
      setNewScreenshot('');
    }
  };

  const removeScreenshot = (screenshot) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter(s => s !== screenshot)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, formData);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', formData);
        toast.success('Project created successfully');
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
          <p className="text-ink-400 text-sm font-mono">loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/projects')}
          className="p-2.5 rounded-xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-400 hover:text-emerald-400 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-mono tracking-wider">
              ~/admin/projects/{isEdit ? 'edit' : 'new'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEdit ? (
              <>Edit <span className="gradient-text">Project</span></>
            ) : (
              <>Create <span className="gradient-text">Project</span></>
            )}
          </h1>
          <p className="text-ink-400 text-sm mt-0.5">
            {isEdit ? 'Update your project details' : 'Add a new project to your portfolio'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">basic.information</span>
            <span className="ml-auto text-rose-400 text-xs font-mono">* required</span>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Hash className="w-3 h-3" />
                  <span>// project title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  <span>// category *</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  required
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="React">React</option>
                  <option value="MERN">MERN</option>
                  <option value="API Application">API Application</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <span>// short description *</span>
                </label>
                <span className={`text-xs font-mono ${
                  formData.shortDescription.length > 180 ? 'text-amber-400' : 'text-ink-500'
                }`}>
                  {formData.shortDescription.length}/200
                </span>
              </div>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                maxLength="200"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                required
                placeholder="A brief description of your project"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <span>// full description *</span>
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm resize-vertical"
                required
                placeholder="Detailed description of your project, what it does, and why you built it..."
              />
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">media.assets</span>
            <span className="ml-auto text-ink-500 text-xs font-mono">
              {formData.screenshots.length} screenshots
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Thumbnail */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <span>// thumbnail image *</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="Enter image URL or upload"
                  className="flex-1 px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                />
                <input
                  type="file"
                  name="thumbnail"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer transition-all whitespace-nowrap font-mono text-sm ${
                    uploading 
                      ? 'bg-ink-900/60 text-ink-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white hover:shadow-glow-emerald'
                  }`}
                >
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload</>
                  )}
                </label>
                {formData.thumbnail && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                    className="p-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-rose-500/40 hover:bg-rose-500/5 text-ink-400 hover:text-rose-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {formData.thumbnail && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-emerald-500/30 bg-ink-900">
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-mono">thumbnail ready</span>
                  </div>
                </div>
              )}
            </div>

            {/* Screenshots */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <span>// screenshots gallery</span>
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  value={newScreenshot}
                  onChange={(e) => setNewScreenshot(e.target.value)}
                  placeholder="Enter screenshot URL or upload"
                  className="flex-1 px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addScreenshot())}
                />
                <input
                  type="file"
                  name="screenshot"
                  id="screenshot-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="screenshot-upload"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer transition-all whitespace-nowrap font-mono text-sm ${
                    uploading 
                      ? 'bg-ink-900/60 text-ink-500 cursor-not-allowed' 
                      : 'bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400'
                  }`}
                >
                  <Upload className="w-4 h-4" /> Upload
                </label>
                <button
                  type="button"
                  onClick={addScreenshot}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400 transition-all font-mono text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {formData.screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-ink-700/40 bg-ink-900">
                      <img 
                        src={screenshot} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-24 object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-ink-900/80 text-emerald-400 border border-emerald-500/30">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeScreenshot(screenshot)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl border border-dashed border-ink-700/40 bg-ink-900/20">
                  <ImageIcon className="w-8 h-8 text-ink-600 mx-auto mb-2" />
                  <p className="text-ink-500 text-xs font-mono">no screenshots added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tech & Features */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">tech.features</span>
            <span className="ml-auto text-ink-500 text-xs font-mono">
              {formData.technologies.length} tech · {formData.features.length} features
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Technologies */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <Code2 className="w-3 h-3" />
                <span>// technologies used</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g., React.js"
                  className="flex-1 px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400 transition-all font-mono text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {formData.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/15 rounded-lg text-xs text-emerald-400 font-mono hover:bg-emerald-500/15 transition-all"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="text-emerald-400/60 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-ink-600 text-xs font-mono">no technologies added</p>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <Star className="w-3 h-3" />
                <span>// key features</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g., User Authentication"
                  className="flex-1 px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400 transition-all font-mono text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {formData.features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <span
                      key={feature}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/8 border border-teal-500/15 rounded-lg text-xs text-teal-400 font-mono hover:bg-teal-500/15 transition-all"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-teal-400/60 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-ink-600 text-xs font-mono">no features added</p>
              )}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Link2 className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">project.links</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <Github className="w-3 h-3" />
                <span>// github url</span>
              </label>
              <input
                type="text"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <Globe className="w-3 h-3" />
                <span>// live demo url</span>
              </label>
              <input
                type="text"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://project.vercel.app"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Challenges & Solutions */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">dev.notes</span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3" />
                <span>// challenges faced</span>
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-amber-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm resize-vertical"
                placeholder="What challenges did you face during development?"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                <Target className="w-3 h-3" />
                <span>// solutions implemented</span>
              </label>
              <textarea
                name="solutions"
                value={formData.solutions}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm resize-vertical"
                placeholder="How did you solve these challenges?"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">project.settings</span>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Hash className="w-3 h-3" />
                  <span>// display order</span>
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <span>// status</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 cursor-pointer hover:bg-amber-500/10 transition-all">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-emerald-500"
              />
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${formData.featured ? 'text-amber-400 fill-amber-400' : 'text-ink-500'}`} />
                <span className="text-ink-300 text-sm font-mono">mark as featured project</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-ink-800/30 border border-ink-700/20">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${saving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-ink-400 text-xs font-mono">
              {saving ? 'saving changes...' : uploading ? 'uploading...' : 'ready to save'}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-ink-600/50 text-ink-300 hover:text-white text-sm font-medium font-mono transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;