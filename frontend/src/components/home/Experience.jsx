import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { Calendar, Code2 } from 'lucide-react';

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
        setJourney([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        </div>
      </section>
    );
  }

  // If no journey data, show default content
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

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            My learning path and experience
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-purple-500/30 transform md:-translate-x-1/2" />

          {displayJourney.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex items-start gap-6 mb-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-4 md:left-1/2 top-1.5 w-4 h-4 rounded-full bg-purple-500 border-4 border-dark-400 transform -translate-x-1/2 z-10" />

              <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
              }`}>
                <div className="glass rounded-xl p-5 border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    {item.current && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    {item.endDate ? (
                      ` - ${new Date(item.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                    ) : (
                      ' - Present'
                    )}
                  </div>
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.technologies.map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
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