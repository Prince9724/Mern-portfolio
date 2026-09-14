import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.body.classList.add('light-theme');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-dark py-3 shadow-soft' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white font-mono">prince</span>
              <span className="text-emerald-400 font-mono">.dev</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-ink-300 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/5 cursor-pointer relative group"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Social Links */}
            <div className="flex items-center gap-1 pr-3 border-r border-ink-700/30">
              <a 
                href="https://github.com/Prince9724" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-ink-400 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/prince-gond-69090b375/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-ink-400 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:princegondrw123@gmail.com"
                className="p-2 text-ink-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-emerald-500/5 transition-colors text-ink-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-dark absolute top-full left-0 right-0 border-t border-ink-700/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-3 text-ink-300 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all text-base font-medium rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="flex gap-2 pt-4 border-t border-ink-700/20">
                <a href="https://github.com/Prince9724" target="_blank" rel="noopener noreferrer" className="flex-1 p-3 text-center text-ink-400 hover:text-emerald-400 glass rounded-lg transition-colors">
                  <Github className="w-5 h-5 mx-auto" />
                </a>
                <a href="https://www.linkedin.com/in/prince-gond-69090b375/" target="_blank" rel="noopener noreferrer" className="flex-1 p-3 text-center text-ink-400 hover:text-emerald-400 glass rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5 mx-auto" />
                </a>
                <a href="mailto:princegondrw123@gmail.com" className="flex-1 p-3 text-center text-ink-400 hover:text-emerald-400 glass rounded-lg transition-colors">
                  <Mail className="w-5 h-5 mx-auto" />
                </a>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 w-full px-4 py-3 text-ink-300 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all rounded-lg"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;