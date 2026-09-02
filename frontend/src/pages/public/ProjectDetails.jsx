import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Calendar, Code2 } from 'lucide-react';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await publicApi.get(`/projects/${slug}`);
        setProject(data.data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl text-white mb-4">Project Not Found</h2>
        <Link to="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/#projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl font-bold text-white"
            >
              {project.title}
            </motion.h1>
            <div className="flex flex-wrap gap-3 mt-3">
              {project.technologies.map(tech => (
                <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{project.fullDescription}</p>
            </motion.div>

            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {project.screenshots && project.screenshots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-xl font-semibold text-white mb-3">Screenshots</h2>
                <div className="grid grid-cols-2 gap-3">
                  {project.screenshots.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Screenshot ${i + 1}`}
                      className="rounded-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {project.challenges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-xl font-semibold text-white mb-3">Challenges & Solutions</h2>
                <p className="text-gray-300 leading-relaxed">{project.challenges}</p>
                {project.solutions && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="text-purple-400 font-medium mb-1">💡 Solution</h4>
                    <p className="text-gray-300">{project.solutions}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/5 sticky top-24">
              <h3 className="text-white font-semibold mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="text-white font-medium">{project.category}</p>
                </div>
                {project.githubUrl && (
                  <div>
                    <p className="text-gray-400">Repository</p>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Github className="w-4 h-4" /> View on GitHub
                    </a>
                  </div>
                )}
                {project.liveUrl && (
                  <div>
                    <p className="text-gray-400">Live Demo</p>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" /> Visit Live Site
                    </a>
                  </div>
                )}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-gray-400 text-xs">Posted on</p>
                  <p className="text-gray-300 text-sm">{new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass hover:glass-dark rounded-lg transition-colors border border-white/10 text-white"
                  >
                    <Github className="w-4 h-4" /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
                  >
                    <ExternalLink className="w-4 h-4" /> Live
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;