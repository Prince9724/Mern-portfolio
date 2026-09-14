import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { Calendar, Terminal, CheckCircle2 } from 'lucide-react';

const Experience = () => {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const { data } = await publicApi.get('/journey');
        setJourney(data.data || []);
      } catch (error) {
        console.error('Error fetching journey:', error);
        setJourney([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
        </div>
      </section>
    );
  }

  const displayJourney = journey.length > 0 ? journey : [
    {
      _id: '1',
      title: 'Started Web Development',
      description: 'Began journey with HTML, CSS, and JavaScript',
      startDate: new Date('2022-01-01'),
      current: false,
      technologies: ['HTML', 'CSS', 'JavaScript']
    },
    {
      _id: '2',
      title: 'Full Stack MERN Developer',
      description: 'Building modern web applications with MERN stack',
      startDate: new Date('2023-06-01'),
      current: true,
      technologies: ['React', 'Node.js', 'MongoDB']
    }
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Section Header - CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-emerald-500/50" />
            <span className="text-emerald-400 text-sm font-mono tracking-wider">04. JOURNEY</span>
            <div className="h-px w-12 bg-emerald-500/50" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-white">My</span>{' '}
            <span className="gradient-text">Journey</span>
          </h2>
          
          <p className="text-ink-400 mt-4 max-w-2xl mx-auto text-lg">
            The path that shaped me as a developer
          </p>
          
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-ink-800/40 border border-ink-700/30">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">~/.career --timeline</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line - Gradient */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/60 via-emerald-500/20 to-transparent transform md:-translate-x-1/2" />

          {displayJourney.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`relative flex items-start gap-6 mb-10 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 top-4 transform -translate-x-1/2 z-10">
                <div className="relative">
                  {item.current && (
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  )}
                  <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                    item.current 
                      ? 'bg-emerald-400 border-emerald-300 shadow-glow-emerald' 
                      : 'bg-ink-800 border-emerald-500/50'
                  }`} />
                </div>
              </div>

              {/* Card */}
              <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-14' : 'md:pl-14'
              }`}>
                <div className="group relative p-5 rounded-2xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-white font-semibold text-lg leading-tight">
                      {item.title}
                    </h4>
                    {item.current && (
                      <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-mono font-medium">active</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-ink-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-ink-500 text-xs font-mono mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.startDate)}</span>
                    <span className="text-emerald-500/50">→</span>
                    <span>{item.endDate ? formatDate(item.endDate) : 'present'}</span>
                  </div>

                  {/* Technologies */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-ink-700/30">
                      {item.technologies.map(tech => (
                        <span 
                          key={tech} 
                          className="px-2 py-0.5 bg-emerald-500/8 border border-emerald-500/15 rounded text-xs text-emerald-400 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-emerald-400/40 group-hover:bg-emerald-400 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;