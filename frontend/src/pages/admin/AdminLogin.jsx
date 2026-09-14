import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginAdmin, clearError } from '../../store/slices/authSlice';
import { Terminal, Eye, EyeOff, Loader2, Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    await dispatch(loginAdmin({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 p-4 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Login Card */}
        <div className="relative rounded-2xl bg-ink-800/60 backdrop-blur-xl border border-ink-700/40 overflow-hidden shadow-elevated">
          
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/40 bg-ink-900/40">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="ml-3 text-ink-400 text-xs font-mono">admin-login.sh</span>
            <div className="ml-auto flex items-center gap-1.5 text-emerald-400/60">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-mono">secure</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex justify-center mb-5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl" />
                  <div className="relative p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <Terminal className="w-8 h-8 text-emerald-400" />
                  </div>
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-white font-mono">
                Admin<span className="text-emerald-400">.access</span>
              </h2>
              <p className="text-ink-400 text-sm mt-2">
                Sign in to manage your portfolio
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Mail className="w-3 h-3" />
                  <span>// email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm"
                  placeholder="admin@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  <span>// password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all font-mono text-sm pr-12"
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-ink-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:shadow-glow-emerald font-mono text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Note */}
            <div className="mt-6 pt-6 border-t border-ink-700/30">
              <div className="flex items-center justify-center gap-2 text-ink-500 text-xs font-mono">
                <Shield className="w-3 h-3" />
                <span>Secure admin access only</span>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="px-5 py-3 border-t border-ink-700/40 bg-ink-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono">system online</span>
            </div>
            <span className="text-ink-500 text-xs font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-ink-500 text-xs font-mono mt-6">
          <span className="text-emerald-400">$</span> authorized access only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;