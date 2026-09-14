import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { Code2, Database, Server, Wrench, BookOpen, Terminal } from 'lucide-react';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    const categoryIcons = {
        'Frontend': Code2,
        'Backend': Server,
        'Database': Database,
        'Tools': Wrench,
        'Currently Learning': BookOpen,
    };

    const categoryColors = {
        'Frontend': 'text-emerald-400',
        'Backend': 'text-teal-400',
        'Database': 'text-amber-400',
        'Tools': 'text-cyan-400',
        'Currently Learning': 'text-violet-400',
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await publicApi.get('/skills');
                setSkills(data.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const categories = ['all', ...new Set(skills.map(s => s.category))];
    const filteredSkills = activeCategory === 'all'
        ? skills
        : skills.filter(s => s.category === activeCategory);

    if (loading) {
        return (
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500" />
                </div>
            </section>
        );
    }

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-30" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ✅ Section Header - CENTERED */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    {/* Section Number - Centered with dividers */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-emerald-500/50" />
                        <span className="text-emerald-400 text-sm font-mono tracking-wider">02. SKILLS</span>
                        <div className="h-px w-12 bg-emerald-500/50" />
                    </div>
                    
                    {/* Heading - Centered */}
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        <span className="text-white">Tech</span>{' '}
                        <span className="gradient-text">Stack</span>
                    </h2>
                    
                    {/* Subtitle - Centered */}
                    <p className="text-ink-400 mt-4 max-w-2xl mx-auto text-lg">
                        Technologies and tools I work with daily
                    </p>
                    
                    {/* Terminal snippet - Centered */}
                    <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-ink-800/40 border border-ink-700/30">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-mono text-sm">~/stack --list</span>
                    </div>
                </motion.div>

                {/* ✅ Category Filters - CENTERED */}
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
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all ${
                                activeCategory === cat
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'text-ink-400 border border-transparent hover:text-white hover:bg-ink-800/50 hover:border-ink-700/50'
                            }`}
                        >
                            {cat === 'all' ? '// all' : `// ${cat.toLowerCase()}`}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredSkills.map((skill, index) => {
                        const Icon = categoryIcons[skill.category] || Code2;
                        const color = categoryColors[skill.category] || 'text-emerald-400';

                        return (
                            <motion.div
                                key={skill._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                viewport={{ once: true }}
                                className="group relative p-4 rounded-xl bg-ink-800/40 border border-ink-700/30 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className={`w-5 h-5 ${color}`} />
                                        <span className="text-xs font-mono text-ink-500 group-hover:text-emerald-400 transition-colors">
                                            {String(skill.level || 70).padStart(3, '0')}%
                                        </span>
                                    </div>
                                    
                                    <p className="text-white font-medium text-sm mb-3 group-hover:text-emerald-400 transition-colors">
                                        {skill.name}
                                    </p>
                                    
                                    {/* Progress bar */}
                                    <div className="w-full h-1 bg-ink-900/60 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level || 70}%` }}
                                            transition={{ duration: 1, delay: index * 0.03 }}
                                            viewport={{ once: true }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredSkills.length === 0 && (
                    <div className="text-center py-12 text-ink-400 font-mono text-sm">
                        <span className="text-emerald-400">$</span> no skills found in this category
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;