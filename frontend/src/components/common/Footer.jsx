import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react'; // ✅ All icons imported

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-dark border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold">
                <span className="text-white">Prince</span>
                <span className="text-purple-500">.dev</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              Full Stack MERN Developer building modern web applications.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
              <li><a href="/#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a></li>
              <li><a href="/#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <div className="flex gap-3">
              <a 
                href="https://github.com/Prince9724" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 glass rounded-lg hover:glass-dark transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="https://www.linkedin.com/in/prince-gond-69090b375/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 glass rounded-lg hover:glass-dark transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="mailto:princegondrw123@gmail.com"
                className="p-2 glass rounded-lg hover:glass-dark transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">princegondrw123@gmail.com</p>
            <p className="text-gray-400 text-sm">India</p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center text-gray-400 text-sm">
          &copy; {year} Prince Gond. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;