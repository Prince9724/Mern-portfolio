import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { Github, ExternalLink, ArrowUpRight, Star, Terminal } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await publicApi.get('/projects?status=published');
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['all', 'Full Stack', 'Frontend', 'Backend', 'React', 'MERN'];
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl p-4 bg-ink-800/40 border border-ink-700/30 animate-pulse">
                <div className="h-48 rounded-xl bg-ink-900/60" />
                <div className="mt-4 space-y-2">
                  <div className="h-6 w-3/4 bg-ink-900/60 rounded" />
                  <div className="h-4 w-1/2 bg-ink-900/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Section Header - CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Section Number - Centered with divider lines on both sides */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-emerald-500/50" />
            <span className="text-emerald-400 text-sm font-mono tracking-wider">03. PROJECTS</span>
            <div className="h-px w-12 bg-emerald-500/50" />
          </div>
          
          {/* Heading - Centered */}
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-white">Featured</span>{' '}
            <span className="gradient-text">Work</span>
          </h2>
          
          {/* Subtitle - Centered */}
          <p className="text-ink-400 mt-4 max-w-2xl mx-auto text-lg">
            A selection of projects I've built
          </p>
          
          {/* Terminal snippet - Centered */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-ink-800/40 border border-ink-700/30">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">~/projects --total={projects.length}</span>
          </div>
        </motion.div>

        {/* ✅ Filters - CENTERED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all ${
                filter === cat
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-ink-400 border border-transparent hover:text-white hover:bg-ink-800/50 hover:border-ink-700/50'
              }`}
            >
              {cat === 'all' ? '// all' : `// ${cat.toLowerCase()}`}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-elevated"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-ink-900">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400/0B0F14/10B981?text=Project';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 backdrop-blur-sm border border-amber-500/30">
                      <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                      <span className="text-amber-400 text-xs font-mono font-semibold">featured</span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-ink-900/80 backdrop-blur-sm border border-ink-700/50">
                    <span className="text-ink-300 text-xs font-mono">{project.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-ink-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5">
                    {(project.technologies || []).slice(0, 3).map(tech => (
                      <span 
                        key={tech} 
                        className="px-2 py-1 bg-emerald-500/8 border border-emerald-500/15 rounded-md text-xs text-emerald-400 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.technologies || []).length > 3 && (
                      <span className="px-2 py-1 bg-ink-900/60 border border-ink-700/40 rounded-md text-xs text-ink-400 font-mono">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-ink-700/30">
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="View Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium font-mono group/link"
                    >
                      view
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-ink-400 font-mono text-sm">
            <span className="text-emerald-400">$</span> {projects.length === 0 
              ? 'no projects found — add one from admin panel' 
              : `no projects in category "${filter}"`}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;