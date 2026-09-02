const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Journey = require('../models/Journey');

dotenv.config();

const projects = [
  {
    title: 'Core Banking System',
    slug: 'core-banking-system',
    shortDescription: 'A comprehensive Core Banking System built using the MERN stack with role-based authentication and dashboards.',
    fullDescription: 'A comprehensive Core Banking System built using the MERN stack. The application includes role-based authentication and dashboards for administrators, managers, and tellers. Features include secure authentication, JWT token-based authorization, admin dashboard, branch management, customer management, bank account management, deposit and withdrawal transactions, transaction history, manager dashboard, teller dashboard, branch-wise data management, and secure cookie authentication.',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'Redux Toolkit', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Axios'],
    features: ['Secure Authentication', 'JWT Authentication', 'Role Based Authorization', 'Admin Dashboard', 'Branch Management', 'Customer Management', 'Bank Account Management', 'Deposit Transactions', 'Withdrawal Transactions', 'Transaction History', 'Manager Dashboard', 'Teller Dashboard', 'Branch-wise Data Management', 'Secure Cookie Authentication'],
    challenges: 'Implementing role-based access control and securing different user roles with JWT authentication.',
    solutions: 'Used JWT with HTTP-only cookies and middleware-based role verification for secure access control.',
    githubUrl: 'https://github.com/princegond/core-banking-system',
    liveUrl: 'https://core-banking-system.vercel.app',
    category: 'Full Stack',
    featured: true,
    status: 'published',
    displayOrder: 1
  },
  {
    title: 'Restaurant POS System',
    slug: 'restaurant-pos-system',
    shortDescription: 'A modern restaurant Point of Sale application for managing food orders, menu items, and billing.',
    fullDescription: 'A modern restaurant Point of Sale application designed to manage food orders, menu items, billing, and restaurant operations. Features include menu management, food categories, order management, cart system, billing interface, responsive dashboard, and state management.',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'Redux Toolkit', 'JavaScript', 'CSS', 'API Integration'],
    features: ['Menu Management', 'Food Categories', 'Order Management', 'Cart System', 'Billing Interface', 'Responsive Dashboard', 'State Management'],
    challenges: 'Managing real-time order updates and maintaining cart state across the application.',
    solutions: 'Used Redux Toolkit for centralized state management and real-time updates.',
    githubUrl: 'https://github.com/princegond/restaurant-pos',
    liveUrl: 'https://restaurant-pos.vercel.app',
    category: 'Frontend',
    featured: true,
    status: 'published',
    displayOrder: 2
  },
  {
    title: 'E-Commerce Web Application',
    slug: 'ecommerce-web-application',
    shortDescription: 'A modern e-commerce platform with a responsive shopping experience and interactive product browsing.',
    fullDescription: 'A modern e-commerce platform with a responsive shopping experience and interactive product browsing. Features include product listing, product details, shopping cart, search functionality, product filtering, responsive UI, and user interface components.',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'JavaScript', 'CSS', 'Bootstrap', 'Tailwind CSS'],
    features: ['Product Listing', 'Product Details', 'Shopping Cart', 'Search', 'Product Filtering', 'Responsive UI', 'User Interface Components'],
    challenges: 'Building a responsive and interactive shopping cart experience.',
    solutions: 'Used React state management with context API for cart functionality.',
    githubUrl: 'https://github.com/princegond/ecommerce-app',
    liveUrl: 'https://ecommerce-app.vercel.app',
    category: 'Full Stack',
    featured: true,
    status: 'published',
    displayOrder: 3
  },
  {
    title: 'Twitter Clone',
    slug: 'twitter-clone',
    shortDescription: 'A social media application inspired by Twitter with a modern feed interface and interactive social features.',
    fullDescription: 'A social media application inspired by Twitter with a modern feed interface and interactive social features. Features include social feed, post interface, user profiles, responsive layout, interactive UI, and modern social media design.',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'JavaScript', 'CSS'],
    features: ['Social Feed', 'Post Interface', 'User Profiles', 'Responsive Layout', 'Interactive UI', 'Modern Social Media Design'],
    challenges: 'Creating a responsive and interactive social media feed.',
    solutions: 'Used React components with CSS for a clean social media interface.',
    githubUrl: 'https://github.com/princegond/twitter-clone',
    liveUrl: 'https://twitter-clone.vercel.app',
    category: 'Frontend',
    featured: false,
    status: 'published',
    displayOrder: 4
  },
  {
    title: 'HRMS — Human Resource Management System',
    slug: 'human-resource-management-system',
    shortDescription: 'A Human Resource Management System designed to manage employees, organizational information, and HR operations.',
    fullDescription: 'A Human Resource Management System designed to manage employees, organizational information, and HR-related operations. Features include employee management, dashboard, data management, authentication, administrative interface, and responsive UI.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    features: ['Employee Management', 'Dashboard', 'Data Management', 'Authentication', 'Administrative Interface', 'Responsive UI'],
    challenges: 'Building a comprehensive HR management system with role-based access.',
    solutions: 'Used MERN stack with JWT authentication for secure employee management.',
    githubUrl: 'https://github.com/princegond/hrms',
    liveUrl: 'https://hrms.vercel.app',
    category: 'Full Stack',
    featured: true,
    status: 'published',
    displayOrder: 5
  },
  {
    title: 'Weather Application',
    slug: 'weather-application',
    shortDescription: 'A responsive weather application that provides weather information using external API integration.',
    fullDescription: 'A responsive weather application that provides weather information using external API integration. Features include city search, live weather data, temperature information, weather conditions, responsive design, and API integration.',
    thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop'
    ],
    technologies: ['JavaScript', 'React.js', 'OpenWeatherMap API', 'CSS'],
    features: ['City Search', 'Live Weather Data', 'Temperature Information', 'Weather Conditions', 'Responsive Design', 'API Integration'],
    challenges: 'Integrating external weather API and handling data fetching.',
    solutions: 'Used Axios for API calls and React state for data management.',
    githubUrl: 'https://github.com/princegond/weather-app',
    liveUrl: 'https://weather-app.vercel.app',
    category: 'API Application',
    featured: false,
    status: 'published',
    displayOrder: 6
  },
  {
    title: 'Interactive Quiz Application',
    slug: 'interactive-quiz-application',
    shortDescription: 'An interactive quiz application with dynamic questions and score tracking.',
    fullDescription: 'An interactive quiz application with dynamic questions and score tracking. Features include multiple questions, score tracking, interactive UI, dynamic question flow, and responsive design.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    features: ['Multiple Questions', 'Score Tracking', 'Interactive UI', 'Dynamic Question Flow', 'Responsive Design'],
    challenges: 'Creating a dynamic quiz flow with real-time score tracking.',
    solutions: 'Used React state management for question flow and score calculation.',
    githubUrl: 'https://github.com/princegond/quiz-app',
    liveUrl: 'https://quiz-app.vercel.app',
    category: 'Frontend',
    featured: false,
    status: 'published',
    displayOrder: 7
  },
  {
    title: 'CellCity Mobile',
    slug: 'cellcity-mobile',
    shortDescription: 'A modern mobile shopping website focused on showcasing smartphones and mobile products.',
    fullDescription: 'A modern mobile shopping website focused on showcasing smartphones and mobile products. Features include mobile product showcase, product cards, responsive layout, product categories, and modern UI.',
    thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    features: ['Mobile Product Showcase', 'Product Cards', 'Responsive Layout', 'Product Categories', 'Modern UI'],
    challenges: 'Creating a visually appealing mobile store interface.',
    solutions: 'Used modern CSS with React components for a clean mobile store UI.',
    githubUrl: 'https://github.com/princegond/cellcity',
    liveUrl: 'https://cellcity.vercel.app',
    category: 'E-Commerce',
    featured: false,
    status: 'published',
    displayOrder: 8
  },
  {
    title: 'ShopSphere',
    slug: 'shopsphere',
    shortDescription: 'A modern shopping platform focused on creating a clean and interactive online shopping experience.',
    fullDescription: 'A modern shopping platform focused on creating a clean and interactive online shopping experience. Features include product browsing, product categories, responsive UI, modern shopping interface, and interactive components.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'JavaScript', 'CSS', 'API Integration'],
    features: ['Product Browsing', 'Product Categories', 'Responsive UI', 'Modern Shopping Interface', 'Interactive Components'],
    challenges: 'Building an interactive shopping platform with product categories.',
    solutions: 'Used React components with dynamic product filtering.',
    githubUrl: 'https://github.com/princegond/shopsphere',
    liveUrl: 'https://shopsphere.vercel.app',
    category: 'E-Commerce',
    featured: false,
    status: 'published',
    displayOrder: 9
  },
  {
    title: 'StyleHub — Fashion E-Commerce Platform',
    slug: 'stylehub-fashion-ecommerce',
    shortDescription: 'A modern fashion e-commerce platform created for showcasing products with a premium shopping experience.',
    fullDescription: 'A modern fashion e-commerce platform created for showcasing products with a premium shopping experience. Features include product management, product display, admin features, authentication, responsive design, and modern fashion UI.',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
    features: ['Product Management', 'Product Display', 'Admin Features', 'Authentication', 'Responsive Design', 'Modern Fashion UI'],
    challenges: 'Building a full-stack fashion e-commerce platform with admin features.',
    solutions: 'Used MERN stack with Cloudinary for image management.',
    githubUrl: 'https://github.com/princegond/stylehub',
    liveUrl: 'https://stylehub.vercel.app',
    category: 'Full Stack',
    featured: true,
    status: 'published',
    displayOrder: 10
  },
  {
    title: 'Full Stack Developer Portfolio CMS',
    slug: 'full-stack-developer-portfolio-cms',
    shortDescription: 'A complete developer portfolio website with a secure admin CMS for dynamic content management.',
    fullDescription: 'A complete developer portfolio website with a secure admin CMS that allows dynamic management of projects, skills, portfolio content, messages, and website settings. Features include dynamic portfolio, secure admin panel, project management, skill management, contact message management, CMS settings, image upload, JWT authentication, Cloudinary integration, and MongoDB database.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Cloudinary', 'Tailwind CSS'],
    features: ['Dynamic Portfolio', 'Secure Admin Panel', 'Project Management', 'Skill Management', 'Contact Message Management', 'CMS Settings', 'Image Upload', 'JWT Authentication', 'Cloudinary Integration', 'MongoDB Database'],
    challenges: 'Building a secure admin panel with CMS capabilities.',
    solutions: 'Used JWT with HTTP-only cookies and role-based access control.',
    githubUrl: 'https://github.com/princegond/portfolio',
    liveUrl: 'https://princegond.dev',
    category: 'Full Stack',
    featured: true,
    status: 'published',
    displayOrder: 11
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert projects
    const inserted = await Project.insertMany(projects);
    console.log(`✅ Seeded ${inserted.length} projects successfully!`);

    // Check featured projects
    const featured = inserted.filter(p => p.featured);
    console.log(`⭐ ${featured.length} featured projects:`);
    featured.forEach(p => console.log(`   - ${p.title}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();