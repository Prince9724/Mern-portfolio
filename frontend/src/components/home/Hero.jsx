import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/api';

const Hero = () => {
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
    social: {
      github: 'https://github.com/Prince9724',
      linkedin: 'https://www.linkedin.com/in/prince-gond-69090b375/',
      email: 'princegondrw123@gmail.com',
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await publicApi.get('/settings');
        if (data.data) setSettings(data.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
      </section>
    );
  }

  const { hero, social } = settings;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-24">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern" />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/20">
              <span className="status-dot" />
              <span className="text-emerald-400 text-sm font-medium">Available for work</span>
            </div>

            {/* Greeting */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <Terminal className="w-4 h-4" />
                <span>$ whoami</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="text-white">{hero?.name?.split(' ')[0] || 'Prince'}</span>{' '}
                <span className="gradient-text">{hero?.name?.split(' ')[1] || 'Gond'}</span>
              </h1>
              
              <div className="text-xl sm:text-2xl text-ink-300 font-mono">
                {hero?.title || 'Full Stack MERN Developer'}
              </div>
            </div>

            {/* Description */}
            <p className="text-ink-400 text-lg max-w-lg leading-relaxed">
              {hero?.description || 'Building modern, responsive and scalable web applications.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary group"
              >
                {hero?.ctaText || 'View My Work'} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-secondary"
              >
                Contact Me
              </button>

              {hero?.resumeUrl && (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Download className="w-4 h-4" /> Resume
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px w-8 bg-ink-700/40" />
              <div className="flex gap-3">
                <a 
                  href={social?.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href={social?.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={`mailto:${social?.email}`}
                  className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right - Profile Image with Terminal Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
              
              {/* Profile Card */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-emerald-500/20">
                {hero?.profileImage ? (
                  <img
                    src={hero.profileImage}
                    alt={hero?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center">
                    <span className="text-8xl font-bold text-emerald-500/30 font-mono">
                      {hero?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                
                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 glass-dark border-t border-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">{hero?.name}</p>
                      <p className="text-emerald-400 text-xs font-mono">{hero?.title}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 text-xs font-mono">online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Code Badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-3 py-2 glass-dark rounded-xl border border-emerald-500/20 shadow-glow-emerald"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono text-emerald-400">MERN</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-5 h-8 rounded-full border-2 border-ink-700/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-emerald-400/60" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;