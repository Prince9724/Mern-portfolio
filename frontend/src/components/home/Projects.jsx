import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { Github, ExternalLink, Code2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('📊 Fetching projects...');
        const response = await publicApi.get('/projects?status=published');
        console.log('✅ API Response:', response.data);
        console.log('📊 Projects count:', response.data.data?.length || 0);
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Debug: Log projects when they change
  useEffect(() => {
    console.log('📊 Current projects state:', projects);
  }, [projects]);

  const categories = ['all', 'Full Stack', 'Frontend', 'Backend', 'React', 'MERN'];
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  // Debug: Log filtered projects
  console.log('🔍 Filtered projects:', filteredProjects);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="h-48 rounded-lg bg-white/5" />
                <div className="mt-4 space-y-2">
                  <div className="h-6 w-3/4 bg-white/5 rounded" />
                  <div className="h-4 w-1/2 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Here are some of the projects I've built
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-purple-600 text-white'
                  : 'glass text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group glass rounded-xl overflow-hidden hover:glass-dark transition-all hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=No+Image';
                    }}
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-purple-600 text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {(project.technologies || []).slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                    >
                      Details <Code2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {projects.length === 0 
                ? 'No projects found. Add your first project from the admin panel!' 
                : 'No projects found in this category.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;