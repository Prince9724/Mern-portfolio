import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Loader2, Upload, X, FileText, Plus, Trash2 } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadField, setUploadField] = useState(null);
  const [settings, setSettings] = useState({
    hero: {
      greeting: "Hi, I'm",
      name: 'Prince Gond',
      title: 'Full Stack MERN Developer',
      description: 'Building modern, responsive and scalable web applications.',
      profileImage: '',
      resumeUrl: '',
      ctaText: 'View My Work',
    },
    about: {
      heading: 'About Me',
      subtitle: 'Get to know me and my journey as a developer',
      paragraph1: "I'm a passionate Full Stack MERN Developer from India with a strong focus on building modern, responsive, and scalable web applications.",
      paragraph2: "My journey started with frontend development and evolved into full-stack development with the MERN stack.",
      paragraph3: "Currently, I'm diving deep into Next.js and building projects that make a difference.",
      stats: {
        projects: '10+',
        experience: '2+ Years',
        clients: '5+',
        technologies: '15+',
      },
    },
    social: {
      github: 'https://github.com/Prince9724',
      linkedin: 'https://www.linkedin.com/in/prince-gond-69090b375/',
      email: 'princegondrw123@gmail.com',
      twitter: '',
      youtube: '',
    },
    seo: {
      title: 'Prince Gond - Full Stack MERN Developer',
      description: 'Portfolio of Prince Gond, Full Stack MERN Developer',
      keywords: 'Full Stack, MERN, React, Node.js, Developer',
      ogImage: '',
    },
    general: {
      logo: '',
      favicon: '',
      themePreference: 'dark',
    },
  });

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.data) {
        // Merge with defaults to ensure all fields exist
        setSettings(prev => ({
          ...prev,
          ...data.data,
          about: {
            ...prev.about,
            ...data.data.about,
            stats: {
              ...prev.about.stats,
              ...(data.data.about?.stats || {}),
            },
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Nested change for stats
  const handleNestedChange = (section, parentField, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value,
        },
      },
    }));
  };

  const handleImageUpload = async (e, section, field) => {
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
    setUploadField(`${section}.${field}`);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleChange(section, field, response.data.data.url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadField(null);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Please upload PDF, DOC, or DOCX');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadField(`${section}.${field}`);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleChange(section, field, response.data.data.url);
      toast.success('File uploaded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadField(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/admin/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const renderField = (section, field, isNested = false, parentField = null) => {
    const value = isNested
      ? settings[section.key]?.[parentField]?.[field.key] || ''
      : settings[section.key]?.[field.key] || '';
    
    const isImageField = field.key === 'profileImage' || 
                         field.key === 'ogImage' || 
                         field.key === 'logo' || 
                         field.key === 'favicon';
    const isFileField = field.key === 'resumeUrl';

    const updateValue = (newValue) => {
      if (isNested) {
        handleNestedChange(section.key, parentField, field.key, newValue);
      } else {
        handleChange(section.key, field.key, newValue);
      }
    };

    if (field.type === 'textarea') {
      return (
        <div className={field.fullWidth ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label}
          </label>
          <textarea
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            rows={field.rows || 3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-vertical"
            placeholder={field.placeholder || ''}
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label}
          </label>
          <select
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {field.label}
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="flex-1 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          />
          
          {isImageField && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="file"
                id={`upload-${section.key}-${field.key}`}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, section.key, field.key)}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor={`upload-${section.key}-${field.key}`}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                  uploading && uploadField === `${section.key}.${field.key}`
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white`}
              >
                {uploading && uploadField === `${section.key}.${field.key}` ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload</>
                )}
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => updateValue('')}
                  className="p-1.5 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isFileField && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="file"
                id={`upload-${section.key}-${field.key}`}
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, section.key, field.key)}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor={`upload-${section.key}-${field.key}`}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                  uploading && uploadField === `${section.key}.${field.key}`
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white`}
              >
                {uploading && uploadField === `${section.key}.${field.key}` ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload Resume</>
                )}
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => updateValue('')}
                  className="p-1.5 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {isImageField && value && (
          <div className="mt-3">
            <img 
              src={value} 
              alt={field.label}
              className="w-32 h-20 object-cover rounded-lg border border-white/10"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {isFileField && value && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">File uploaded</p>
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-xs truncate block"
              >
                {value.length > 50 ? value.substring(0, 50) + '...' : value}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ✅ UPDATED SECTIONS with About fully editable
  const sections = [
    {
      title: 'Hero Section',
      key: 'hero',
      fields: [
        { label: 'Greeting', key: 'greeting', type: 'text' },
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Title', key: 'title', type: 'text' },
        { label: 'Description', key: 'description', type: 'textarea', fullWidth: true },
        { label: 'Profile Image', key: 'profileImage', type: 'text' },
        { label: 'Resume URL', key: 'resumeUrl', type: 'text' },
        { label: 'CTA Button Text', key: 'ctaText', type: 'text' },
      ],
    },
    {
      title: 'About Section',
      key: 'about',
      description: 'Edit all content shown in your About section',
      fields: [
        { label: 'Section Heading', key: 'heading', type: 'text', placeholder: 'About Me' },
        { label: 'Section Subtitle', key: 'subtitle', type: 'text', placeholder: 'Get to know me...' },
        { 
          label: 'Paragraph 1 (Main Intro)', 
          key: 'paragraph1', 
          type: 'textarea', 
          fullWidth: true, 
          rows: 3,
          placeholder: "I'm a passionate Full Stack MERN Developer..." 
        },
        { 
          label: 'Paragraph 2 (Your Journey)', 
          key: 'paragraph2', 
          type: 'textarea', 
          fullWidth: true, 
          rows: 3,
          placeholder: "My journey started with frontend development..."
        },
        { 
          label: 'Paragraph 3 (Currently Doing)', 
          key: 'paragraph3', 
          type: 'textarea', 
          fullWidth: true, 
          rows: 2,
          placeholder: "Currently, I'm diving deep into Next.js..."
        },
      ],
      // ✅ Nested stats fields
      nestedFields: {
        parentKey: 'stats',
        title: 'Statistics (shown in About section)',
        fields: [
          { label: 'Projects Count', key: 'projects', type: 'text', placeholder: '10+' },
          { label: 'Experience', key: 'experience', type: 'text', placeholder: '2+ Years' },
          { label: 'Clients Count', key: 'clients', type: 'text', placeholder: '5+' },
          { label: 'Technologies Count', key: 'technologies', type: 'text', placeholder: '15+' },
        ],
      },
    },
    {
      title: 'Social Links',
      key: 'social',
      fields: [
        { label: 'GitHub', key: 'github', type: 'text' },
        { label: 'LinkedIn', key: 'linkedin', type: 'text' },
        { label: 'Email', key: 'email', type: 'text' },
        { label: 'Twitter', key: 'twitter', type: 'text' },
        { label: 'YouTube', key: 'youtube', type: 'text' },
      ],
    },
    {
      title: 'SEO Settings',
      key: 'seo',
      fields: [
        { label: 'Website Title', key: 'title', type: 'text' },
        { label: 'Meta Description', key: 'description', type: 'textarea', fullWidth: true },
        { label: 'Keywords', key: 'keywords', type: 'text' },
        { label: 'Open Graph Image', key: 'ogImage', type: 'text' },
      ],
    },
    {
      title: 'General Settings',
      key: 'general',
      fields: [
        { label: 'Logo', key: 'logo', type: 'text' },
        { label: 'Favicon', key: 'favicon', type: 'text' },
        { 
          label: 'Theme Preference', 
          key: 'themePreference', 
          type: 'select',
          options: ['dark', 'light', 'system'],
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your portfolio content and configuration</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map((section) => (
          <div key={section.key} className="glass rounded-xl p-6 border border-white/5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              {section.description && (
                <p className="text-gray-400 text-sm mt-1">{section.description}</p>
              )}
            </div>
            
            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  {renderField(section, field)}
                </div>
              ))}
            </div>

            {/* ✅ Nested Fields (like stats in About) */}
            {section.nestedFields && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-md font-semibold text-emerald-400 mb-4">
                  {section.nestedFields.title}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.nestedFields.fields.map((field) => (
                    <div key={field.key}>
                      {renderField(section, field, true, section.nestedFields.parentKey)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default Settings;