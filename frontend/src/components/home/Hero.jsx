// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { publicApi } from '../../services/api';

// const Hero = () => {
//   const [settings, setSettings] = useState({
//     hero: {
//       greeting: "Hi, I'm",
//       name: 'Prince Gond',
//       title: 'Full Stack MERN Developer',
//       description: 'Building modern, responsive and scalable web applications.',
//       profileImage: '',
//       resumeUrl: '',
//       ctaText: 'View My Work',
//     },
//     social: {
//       github: 'https://github.com/Prince9724',
//       linkedin: 'https://www.linkedin.com/in/prince-gond-69090b375/',
//       email: 'princegondrw123@gmail.com',
//     }
//   });
//   const [loading, setLoading] = useState(true);

//   // Fetch settings from backend
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const { data } = await publicApi.get('/settings');
//         if (data.data) {
//           setSettings(data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching settings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   if (loading) {
//     return (
//       <section className="min-h-screen flex items-center justify-center pt-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
//       </section>
//     );
//   }

//   const { hero, social } = settings;

//   return (
//     <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
//       {/* Animated Background */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Text Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="space-y-6"
//           >
//             <span className="inline-block px-4 py-1.5 glass rounded-full text-sm text-purple-400 border border-purple-500/20">
//               👋 Available for freelance work
//             </span>

//             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
//               {hero?.greeting || "Hi, I'm"}{' '}
//               <span className="gradient-text">{hero?.name || 'Prince Gond'}</span>
//             </h1>

//             <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-300">
//               <span className="inline-block">
//                 {hero?.title || 'Full Stack MERN Developer'}
//               </span>
//             </div>

//             <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
//               {hero?.description || 'Building modern, responsive and scalable web applications with React, Node.js, and MongoDB.'}
//             </p>

//             <div className="flex flex-wrap gap-4 pt-4">
//               <Link
//                 to="/#projects"
//                 className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105"
//               >
//                 {hero?.ctaText || 'View My Work'} <ArrowRight className="w-5 h-5" />
//               </Link>
//               <Link
//                 to="/#contact"
//                 className="inline-flex items-center gap-2 px-8 py-3.5 glass hover:glass-dark text-white rounded-lg font-medium transition-all border border-white/10 hover:border-purple-500/30"
//               >
//                 Contact Me
//               </Link>
//               {hero?.resumeUrl && (
//                 <a
//                   href={hero.resumeUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-8 py-3.5 glass hover:glass-dark text-white rounded-lg font-medium transition-all border border-white/10 hover:border-purple-500/30"
//                 >
//                   <Download className="w-5 h-5" /> Resume
//                 </a>
//               )}
//             </div>

//             <div className="flex gap-4 pt-4">
//               <a 
//                 href={social?.github || '#'} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-purple-400 transition-colors"
//               >
//                 <Github className="w-6 h-6" />
//               </a>
//               <a 
//                 href={social?.linkedin || '#'} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-gray-400 hover:text-purple-400 transition-colors"
//               >
//                 <Linkedin className="w-6 h-6" />
//               </a>
//               <a 
//                 href={`mailto:${social?.email || ''}`} 
//                 className="text-gray-400 hover:text-purple-400 transition-colors"
//               >
//                 <Mail className="w-6 h-6" />
//               </a>
//             </div>
//           </motion.div>

//           {/* Profile Image - Dynamic from Settings */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//             className="relative flex justify-center"
//           >
//             <div className="relative w-72 h-72 lg:w-96 lg:h-96">
//               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl animate-pulse" />
//               <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-purple-800 p-1">
//                 <div className="w-full h-full rounded-full bg-dark-400 flex items-center justify-center overflow-hidden">
//                   {hero?.profileImage ? (
//                     <img
//                       src={hero.profileImage}
//                       alt={hero?.name || 'Profile'}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = `<span class="text-8xl font-bold text-purple-500/20">${hero?.name?.charAt(0) || 'P'}</span>`;
//                       }}
//                     />
//                   ) : (
//                     <span className="text-8xl font-bold text-purple-500/20">
//                       {hero?.name?.charAt(0) || 'P'}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
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

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await publicApi.get('/settings');
        if (data.data) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </section>
    );
  }

  const { hero, social } = settings;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 glass rounded-full text-sm text-purple-400 border border-purple-500/20">
              👋 Available for freelance work
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              {hero?.greeting || "Hi, I'm"}{' '}
              <span className="gradient-text">{hero?.name || 'Prince Gond'}</span>
            </h1>

            <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-300">
              <span className="inline-block">
                {hero?.title || 'Full Stack MERN Developer'}
              </span>
            </div>

            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
              {hero?.description || 'Building modern, responsive and scalable web applications with React, Node.js, and MongoDB.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* View My Work - Scroll to Projects Section */}
              <button
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
              >
                {hero?.ctaText || 'View My Work'} <ArrowRight className="w-5 h-5" />
              </button>

              {/* Contact Me - Scroll to Contact Section */}
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 px-8 py-3.5 glass hover:glass-dark text-white rounded-lg font-medium transition-all border border-white/10 hover:border-purple-500/30 cursor-pointer"
              >
                Contact Me
              </button>

              {/* Resume Download */}
              {hero?.resumeUrl && (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 glass hover:glass-dark text-white rounded-lg font-medium transition-all border border-white/10 hover:border-purple-500/30 cursor-pointer"
                >
                  <Download className="w-5 h-5" /> Resume
                </a>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <a 
                href={social?.github || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href={social?.linkedin || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href={`mailto:${social?.email || ''}`} 
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </motion.div>

          {/* Profile Image - Dynamic from Settings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-purple-800 p-1">
                <div className="w-full h-full rounded-full bg-dark-400 flex items-center justify-center overflow-hidden">
                  {hero?.profileImage ? (
                    <img
                      src={hero.profileImage}
                      alt={hero?.name || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="text-8xl font-bold text-purple-500/20">${hero?.name?.charAt(0) || 'P'}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-8xl font-bold text-purple-500/20">
                      {hero?.name?.charAt(0) || 'P'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;