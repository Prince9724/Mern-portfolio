import { motion } from 'framer-motion';
import { Code2, Briefcase, Users, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Code2, label: 'Projects', value: '10+' },
    { icon: Briefcase, label: 'Experience', value: '2+ Years' },
    { icon: Users, label: 'Clients', value: '5+' },
    { icon: Award, label: 'Technologies', value: '15+' },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Get to know me and my journey as a developer
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-gray-300 leading-relaxed">
              I'm a passionate Full Stack MERN Developer from India with a strong focus on building
              modern, responsive, and scalable web applications. I love turning complex problems into
              elegant solutions.
            </p>
            <p className="text-gray-300 leading-relaxed">
              My journey started with frontend development and evolved into full-stack development
              with the MERN stack. I'm constantly learning and exploring new technologies to stay
              updated with the latest trends.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Currently, I'm diving deep into Next.js and building projects that make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-6 text-center border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;