import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, Users, Award } from 'lucide-react';
import { publicApi } from '../../services/api';

const About = () => {
  const [about, setAbout] = useState({
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await publicApi.get('/settings');
        if (data.data?.about) {
          setAbout(prev => ({
            ...prev,
            ...data.data.about,
            stats: {
              ...prev.stats,
              ...(data.data.about.stats || {}),
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching about settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
        </div>
      </section>
    );
  }

  const stats = [
    { icon: Code2, label: 'Projects', value: about.stats?.projects || '10+' },
    { icon: Briefcase, label: 'Experience', value: about.stats?.experience || '2+ Years' },
    { icon: Users, label: 'Clients', value: about.stats?.clients || '5+' },
    { icon: Award, label: 'Technologies', value: about.stats?.technologies || '15+' },
  ];

  // Get all paragraphs (filter empty ones)
  const paragraphs = [
    about.paragraph1,
    about.paragraph2,
    about.paragraph3,
  ].filter(Boolean);

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-emerald-500/50" />
            <span className="text-emerald-400 text-sm font-mono">01. about</span>
            <div className="h-px w-8 bg-emerald-500/50" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-white">{about.heading?.split(' ')[0] || 'About'}</span>{' '}
            <span className="gradient-text">{about.heading?.split(' ').slice(1).join(' ') || 'Me'}</span>
          </h2>
          <p className="text-ink-400 mt-4 max-w-2xl mx-auto">
            {about.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Paragraphs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {paragraphs.map((para, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-ink-300 leading-relaxed text-lg">
                  {para}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                    <stat.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white font-mono">{stat.value}</p>
                <p className="text-ink-400 text-sm mt-1 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;