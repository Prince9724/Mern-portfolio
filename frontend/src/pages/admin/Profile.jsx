import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Camera, 
  Save, 
  Loader2, 
  Upload, 
  X, 
  Terminal, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { admin, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    profileImage: admin?.profileImage || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 📤 Profile Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
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
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
      toast.success('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        profileImage: formData.profileImage,
      };

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await dispatch(updateProfile(updateData)).unwrap();
      toast.success('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-mono tracking-wider">~/admin/profile</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          <span className="text-white">Account</span>{' '}
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-ink-400 mt-1">Manage your admin account and security</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Overview Card - Terminal Style */}
        <div className="relative rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="ml-2 text-ink-400 text-xs font-mono">profile.overview</span>
            <div className="ml-auto flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-mono">verified</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  {/* Glow */}
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Avatar */}
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1">
                    <div className="w-full h-full rounded-full bg-ink-900 flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <img 
                          src={formData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-4xl font-bold text-emerald-400 font-mono">${formData.name?.charAt(0) || 'A'}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-4xl font-bold text-emerald-400 font-mono">
                          {formData.name?.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Upload Button Overlay */}
                  <label className="absolute bottom-0 right-0 p-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-full cursor-pointer transition-all shadow-glow-emerald">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-white font-medium text-sm">
                    {formData.name || 'Admin'}
                  </p>
                  <p className="text-emerald-400 text-xs font-mono">administrator</p>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-ink-500 text-xs font-mono uppercase tracking-wider mb-2">
                    <span className="text-emerald-400">//</span>
                    <span>profile image</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <input
                      type="text"
                      value={formData.profileImage}
                      onChange={(e) => handleChange('profileImage', e.target.value)}
                      placeholder="Enter image URL or upload from PC"
                      className="flex-1 w-full px-4 py-2.5 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                    />
                    <label className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-ink-900/60 border border-ink-700/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-ink-200 hover:text-emerald-400 rounded-xl cursor-pointer transition-all text-sm font-mono whitespace-nowrap">
                      <Upload className="w-4 h-4" />
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {formData.profileImage && (
                      <button
                        type="button"
                        onClick={() => handleChange('profileImage', '')}
                        className="p-2.5 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-rose-500/40 hover:bg-rose-500/5 text-ink-400 hover:text-rose-400 transition-all"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {formData.profileImage && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-mono">image set</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">basic.info</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <User className="w-3 h-3" />
                  <span>// full name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Mail className="w-3 h-3" />
                  <span>// email address</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl bg-ink-800/40 border border-ink-700/30 overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/30 bg-ink-900/40">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-ink-300 text-xs font-mono">security.password</span>
            <div className="ml-auto flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 text-xs font-mono">optional</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Info Note */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-ink-400 text-xs leading-relaxed">
                Leave password fields empty if you don't want to change your password.
                New password must be at least 6 characters long.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  // current
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  // new
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  // confirm
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.newPassword && formData.confirmPassword && (
              <div className="flex items-center gap-2">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-mono">passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400 text-xs font-mono">passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-ink-800/30 border border-ink-700/20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-ink-400 text-xs font-mono">
              {loading ? 'saving changes...' : 'ready to save'}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: admin?.name || '',
                  email: admin?.email || '',
                  profileImage: admin?.profileImage || '',
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-ink-900/60 border border-ink-700/40 hover:border-ink-600/50 text-ink-300 hover:text-white text-sm font-medium font-mono transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || authLoading || uploading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium transition-all hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;