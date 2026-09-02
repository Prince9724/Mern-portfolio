import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Loader2, Upload, X } from 'lucide-react';

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
      text: "I'm a passionate Full Stack MERN Developer from India with a strong focus on building modern, responsive, and scalable web applications.",
      professionalSummary: 'Full Stack Developer with expertise in MERN stack',
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
        setSettings(data.data);
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

  // 📤 Image Upload Handler for Settings
  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }

    // Validate file size (max 5MB)
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const imageUrl = response.data.data.url;
      handleChange(section, field, imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
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
      console.error('Error saving settings:', error);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  // Field renderer with upload support
  const renderField = (section, field) => {
    const value = settings[section.key]?.[field.key] || '';
    const isImageField = field.key === 'profileImage' || 
                         field.key === 'ogImage' || 
                         field.key === 'logo' || 
                         field.key === 'favicon';

    if (field.type === 'textarea') {
      return (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleChange(section.key, field.key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-vertical"
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
            onChange={(e) => handleChange(section.key, field.key, e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
            onChange={(e) => handleChange(section.key, field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="flex-1 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          {isImageField && (
            <div className="flex items-center gap-2">
              <label className={`px-4 py-2 ${uploading && uploadField === `${section.key}.${field.key}` ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 text-sm`}>
                {uploading && uploadField === `${section.key}.${field.key}` ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading && uploadField === `${section.key}.${field.key}` ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, section.key, field.key)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => handleChange(section.key, field.key, '')}
                  className="p-1.5 rounded hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        {isImageField && value && (
          <div className="mt-2">
            <img 
              src={value} 
              alt={field.label}
              className="w-32 h-20 object-cover rounded-lg border border-white/10"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>
    );
  };

  const sections = [
    {
      title: 'Hero Section',
      key: 'hero',
      fields: [
        { label: 'Greeting', key: 'greeting', type: 'text' },
        { label: 'Name', key: 'name', type: 'text' },
        { label: 'Title', key: 'title', type: 'text' },
        { label: 'Description', key: 'description', type: 'textarea' },
        { label: 'Profile Image', key: 'profileImage', type: 'text' },
        { label: 'Resume URL', key: 'resumeUrl', type: 'text' },
        { label: 'CTA Button Text', key: 'ctaText', type: 'text' },
      ],
    },
    {
      title: 'About Section',
      key: 'about',
      fields: [
        { label: 'About Text', key: 'text', type: 'textarea' },
        { label: 'Professional Summary', key: 'professionalSummary', type: 'textarea' },
      ],
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
        { label: 'Meta Description', key: 'description', type: 'textarea' },
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
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map((section) => (
          <div key={section.key} className="glass rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  {renderField(section, field)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default Settings;