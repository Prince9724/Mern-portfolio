const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SiteSettings = require('../models/SiteSettings');

dotenv.config();

const migrateAbout = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let s = await SiteSettings.findOne();
    
    if (!s) {
      s = new SiteSettings();
      console.log('📝 Creating new settings...');
    } else {
      console.log('📝 Updating existing settings...');
    }

    // Build about section with new fields
    s.about = {
      heading: s.about?.heading || 'About Me',
      subtitle: s.about?.subtitle || 'Get to know me and my journey as a developer',
      paragraph1: s.about?.paragraph1 || "I'm a passionate Full Stack MERN Developer from India with a strong focus on building modern, responsive, and scalable web applications.",
      paragraph2: s.about?.paragraph2 || "My journey started with frontend development and evolved into full-stack development with the MERN stack.",
      paragraph3: s.about?.paragraph3 || "Currently, I'm diving deep into Next.js and building projects that make a difference.",
      stats: {
        projects: s.about?.stats?.projects || '10+',
        experience: s.about?.stats?.experience || '2+ Years',
        clients: s.about?.stats?.clients || '5+',
        technologies: s.about?.stats?.technologies || '15+',
      },
    };

    s.markModified('about');
    await s.save();

    console.log('✅ About section migrated successfully!');
    console.log('\n📊 New about section:');
    console.log(JSON.stringify(s.about, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

migrateAbout();