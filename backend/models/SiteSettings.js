const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    greeting: { type: String, default: "Hi, I'm" },
    name: { type: String, default: "Prince Gond" },
    title: { type: String, default: "Full Stack MERN Developer" },
    description: { type: String, default: "Building modern, responsive and scalable web applications." },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    ctaText: { type: String, default: "View My Work" }
  },
  
  // About Section - WITH ALL NEW FIELDS
  about: {
    heading: { 
      type: String, 
      default: "About Me" 
    },
    subtitle: { 
      type: String, 
      default: "Get to know me and my journey as a developer" 
    },
    paragraph1: { 
      type: String, 
      default: "I'm a passionate Full Stack MERN Developer from India with a strong focus on building modern, responsive, and scalable web applications." 
    },
    paragraph2: { 
      type: String, 
      default: "My journey started with frontend development and evolved into full-stack development with the MERN stack." 
    },
    paragraph3: { 
      type: String, 
      default: "Currently, I'm diving deep into Next.js and building projects that make a difference." 
    },
    stats: {
      projects: { type: String, default: "10+" },
      experience: { type: String, default: "2+ Years" },
      clients: { type: String, default: "5+" },
      technologies: { type: String, default: "15+" }
    },
    // Legacy fields (backward compatibility)
    text: { type: String, default: "" },
    professionalSummary: { type: String, default: "" }
  },
  
  // Social Links
  social: {
    github: { type: String, default: "https://github.com/Prince9724" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/prince-gond-69090b375/" },
    email: { type: String, default: "princegondrw123@gmail.com" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" }
  },
  
  // SEO
  seo: {
    title: { type: String, default: "Prince Gond - Full Stack MERN Developer" },
    description: { type: String, default: "Portfolio of Prince Gond, Full Stack MERN Developer" },
    keywords: { type: String, default: "Full Stack, MERN, React, Node.js, Developer" },
    ogImage: { type: String, default: "" }
  },
  
  // General
  general: {
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    themePreference: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);