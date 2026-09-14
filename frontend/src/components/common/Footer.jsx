import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal, ArrowUpRight, Heart } from 'lucide-react';
import { publicApi } from '../../services/api';

const Footer = () => {
  const [settings, setSettings] = useState({
    social: {
      github: 'https://github.com/Prince9724',
      linkedin: 'https://www.linkedin.com/in/prince-gond-69090b375/',
      email: 'princegondrw123@gmail.com',
    },
    contact: {
      email: 'princegondrw123@gmail.com',
      location: 'India',
    },
    hero: {
      name: 'Prince Gond',
      title: 'Full Stack MERN Developer',
    }
  });

  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await publicApi.get('/settings');
        if (data.data) {
          setSettings(prev => ({
            ...prev,
            ...data.data,
            social: { ...prev.social, ...(data.data.social || {}) },
            contact: { ...prev.contact, ...(data.data.contact || {}) },
            hero: { ...prev.hero, ...(data.data.hero || {}) },
          }));
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const { social, contact, hero } = settings;

  const quickLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="relative border-t border-ink-700/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <Terminal className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white font-mono">prince</span>
                <span className="text-emerald-400 font-mono">.dev</span>
              </span>
            </Link>
            
            <p className="text-ink-400 text-sm leading-relaxed mb-6">
              {hero?.title || 'Full Stack MERN Developer'} building modern, scalable web applications.
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono">available for work</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs">//</span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group inline-flex items-center gap-2 text-ink-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-3 transition-all duration-300" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs">//</span>
              <span>Connect</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              <a 
                href={social?.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-ink-400 group-hover:text-emerald-400 transition-colors" />
              </a>
              <a 
                href={social?.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-ink-400 group-hover:text-emerald-400 transition-colors" />
              </a>
              <a 
                href={`mailto:${social?.email}`}
                className="group p-3 rounded-lg bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4 text-ink-400 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-emerald-400 font-mono text-xs">//</span>
              <span>Get in Touch</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href={`mailto:${contact?.email || social?.email}`}
                  className="group flex items-start gap-2 text-ink-400 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-500 group-hover:text-emerald-400 transition-colors" />
                  <span className="break-all">{contact?.email || social?.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-ink-400">
                <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-ink-500 font-mono text-xs">@</span>
                <span>{contact?.location || 'India'}</span>
              </li>
            </ul>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group mt-6 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-mono transition-colors"
            >
              <span>back to top</span>
              <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform rotate-[-45deg]" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ink-700/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-ink-500 text-sm font-mono">
              &copy; {year} <span className="text-ink-400">{hero?.name || 'Prince Gond'}</span>. All rights reserved.
            </p>

            {/* Built with */}
            <p className="text-ink-500 text-xs font-mono flex items-center gap-1.5">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-emerald-400" fill="currentColor" />
              <span>using</span>
              <span className="text-emerald-400">MERN</span>
              <span>stack</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;