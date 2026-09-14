import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { Send, Mail, MapPin, Phone, Loader2, Terminal, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    social: {
      email: 'princegondrw123@gmail.com',
    },
    contact: {
      email: 'princegondrw123@gmail.com',
      location: 'India',
      phone: 'Available on request',
    }
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await publicApi.get('/settings');
        if (data.data) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await publicApi.post('/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const { social, contact } = settings;

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: contact?.email || social?.email || 'princegondrw123@gmail.com',
      href: `mailto:${contact?.email || social?.email}`,
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: contact?.location || 'India',
      href: null,
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: contact?.phone || 'Available on request',
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Section Header - CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Section Number - Centered */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-emerald-500/50" />
            <span className="text-emerald-400 text-sm font-mono tracking-wider">05. CONTACT</span>
            <div className="h-px w-12 bg-emerald-500/50" />
          </div>
          
          {/* Heading - Centered */}
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-white">Let's</span>{' '}
            <span className="gradient-text">Connect</span>
          </h2>
          
          {/* Subtitle - Centered */}
          <p className="text-ink-400 mt-4 max-w-2xl mx-auto text-lg">
            Have a project in mind? Let's build something great together.
          </p>
          
          {/* Terminal snippet - Centered */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-ink-800/40 border border-ink-700/30">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">~/contact --new</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left - Contact Info (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-5 rounded-2xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                    <info.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-500 text-xs font-mono uppercase tracking-wider mb-0.5">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a 
                        href={info.href}
                        className="text-white text-sm font-medium hover:text-emerald-400 transition-colors truncate block"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium truncate">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20"
            >
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for work
              </h3>
              <p className="text-ink-400 text-sm leading-relaxed">
                I'm always open to new opportunities, collaborations, and interesting projects. 
                Feel free to reach out and let's discuss how we can work together.
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Contact Form (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form 
              onSubmit={handleSubmit} 
              className="relative p-6 sm:p-8 rounded-2xl bg-ink-800/40 border border-ink-700/30 backdrop-blur-sm"
            >
              {/* Form Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-ink-700/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="ml-2 text-ink-400 text-xs font-mono">new-message.sh</span>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                      // Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                      // Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    // Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all"
                    placeholder="Project Discussion"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">
                    // Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700/40 rounded-xl text-white placeholder-ink-600 focus:outline-none focus:border-emerald-500/50 focus:bg-ink-900/80 transition-all resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-3.5 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:shadow-glow-emerald"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;