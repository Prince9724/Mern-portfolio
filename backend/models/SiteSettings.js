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
  
  // About Section
  about: {
    text: { type: String, default: "I'm a passionate Full Stack MERN Developer..." },
    professionalSummary: { type: String, default: "..." }
  },
  
  // Social Links
  social: {
    github: { type: String, default: "https://github.com" },
    linkedin: { type: String, default: "https://linkedin.com" },
    email: { type: String, default: "prince@example.com" },
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