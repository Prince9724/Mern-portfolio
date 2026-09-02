import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '../../services/api';
import { Code2, Database, Server, Wrench, BookOpen } from 'lucide-react';

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
        'Frontend': 'text-blue-400',
        'Backend': 'text-green-400',
        'Database': 'text-yellow-400',
        'Tools': 'text-purple-400',
        'Currently Learning': 'text-pink-400',
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await publicApi.get('/skills');
                setSkills(data.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setSkills([]); // Set empty array on error
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
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="skills" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        My <span className="gradient-text">Skills</span>
                    </h2>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Technologies and tools I work with
                    </p>
                </motion.div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? 'bg-purple-600 text-white'
                                    : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {cat === 'all' ? 'All' : cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredSkills.map((skill, index) => {
                        const Icon = categoryIcons[skill.category] || Code2;
                        const color = categoryColors[skill.category] || 'text-purple-400';

                        return (
                            <motion.div
                                key={skill._id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="glass rounded-xl p-5 text-center border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 group"
                            >
                                <Icon className={`w-8 h-8 ${color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                                <p className="text-white font-medium text-sm">{skill.name}</p>
                                <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${skill.level || 70}%` }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredSkills.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No skills found in this category.
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;