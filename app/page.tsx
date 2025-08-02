'use client';import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Home, User, Briefcase, Code, Mail, Github, Linkedin, Phone, MapPin, Download, ExternalLink, Menu, X } from 'lucide-react';

// import profilePhoto from '/assets/hero.png';

const CreativePortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ['start', 'end']
  });

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: Code, label: 'Projects' },
    { id: 'contact', icon: Mail, label: 'Contact' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Geolocation Attendance System',
      description: 'React Native app with real-time chat for location-based attendance tracking with 95% accuracy in location verification.',
      technologies: ['React Native', 'Supabase', 'Firebase', 'Expo'],
      category: 'Mobile App',
      year: '2024',
      achievement: '95% location accuracy',
      link: '#'
    },
    {
      id: 2,
      title: 'Enterprise E-Commerce Platform',
      description: 'Full-stack platform with SSR, analytics dashboard, and inventory management system.',
      technologies: ['Next.js', 'Prisma', 'NextAuth', 'Vercel'],
      category: 'Full Stack',
      year: '2024',
      achievement: '99.9% uptime',
      link: '#'
    },
    {
      id: 3,
      title: 'Solar Power Prediction Model',
      description: 'ML model predicting solar output with weather integration and interactive visualizations.',
      technologies: ['Python', 'scikit-learn', 'Plotly'],
      category: 'AI/ML',
      year: '2024',
      achievement: '92% accuracy',
      link: '#'
    },
    {
      id: 4,
      title: 'Social Media Platform',
      description: 'Scalable platform with microservices architecture and real-time messaging.',
      technologies: ['Turbo Repo', 'TypeScript', 'WebSocket'],
      category: 'Full Stack',
      year: '2024',
      achievement: 'Microservices',
      link: '#'
    }
  ];

  const skills = [
    { name: 'Frontend Development', level: 95, category: 'React, Next.js, Vue' },
    { name: 'Backend Development', level: 90, category: 'Node.js, Python, Django' },
    { name: 'Mobile Development', level: 88, category: 'React Native, Expo' },
    { name: 'Machine Learning', level: 85, category: 'TensorFlow, scikit-learn' },
    { name: 'Cloud & DevOps', level: 87, category: 'AWS, Docker, CI/CD' },
    { name: 'Database Management', level: 92, category: 'PostgreSQL, MongoDB' }
  ];

  const experience = [
    {
      company: 'Google Developer Student Club',
      position: 'Web Developer Lead',
      period: 'Aug 2024 – Present',
      description: 'Led development of web applications for student events using modern tech stack. Improved user engagement by 40% through optimized UI components and mentored 15+ junior developers.',
      achievements: ['40% engagement boost', 'Team leadership', 'React/Node expertise']
    },
    {
      company: 'Career Guidance Cell',
      position: 'Technical Member',
      period: 'Jan 2024 – Present',
      description: 'Developed web-based career tracking tools and organized professional development sessions with industry experts.',
      achievements: ['Tool development', 'Event coordination', 'Student mentoring']
    }
  ];

  const achievements = [
    {
      title: 'Hack to Impact 2024',
      description: 'Top 6 among 500+ teams at national hackathon',
      icon: '🏆'
    },
    {
      title: 'Competitive Programming',
      description: 'CodeChef 3-star (1253), LeetCode 400+',
      icon: '💻'
    },
    {
      title: 'Academic Excellence',
      description: '8.02 CGPA with consistent performance',
      icon: '🎓'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const theme = isDarkMode ? {
    bg: 'bg-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    accent: 'bg-gradient-to-r from-cyan-500 to-blue-500'
  } : {
    bg: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    card: 'bg-gray-50',
    border: 'border-gray-200',
    accent: 'bg-gradient-to-r from-blue-600 to-purple-600'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.bg}`}>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 ${theme.card} backdrop-blur-md border-b ${theme.border}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${theme.accent} text-white`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
          
          <h1 className={`text-xl font-bold ${theme.text}`}>H. Daraboina</h1>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-md ${theme.text}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-0 right-0 z-40 ${theme.card} border-b ${theme.border} shadow-lg md:hidden`}
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.id 
                          ? `${theme.accent} text-white` 
                          : `${theme.text} hover:${theme.card}`
                      }`}
                    >
                      <Icon className="mr-3" size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`hidden md:flex fixed left-0 top-0 h-screen w-20 z-50 flex-col items-center justify-center ${theme.card} backdrop-blur-md border-r ${theme.border}`}
      >
        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-6 p-3 rounded-full ${theme.accent} text-white`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </motion.button>

        <div className="flex flex-col items-center space-y-8">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2, x: 10 }}
                whileTap={{ scale: 0.9 }}
                className={`relative p-3 rounded-full transition-all duration-300 group ${
                  activeSection === item.id 
                    ? `${theme.accent} text-white shadow-lg` 
                    : `${theme.card} ${theme.text} hover:${theme.accent} hover:text-white`
                }`}
              >
                <Icon size={20} />
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className={`absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-1 ${theme.card} ${theme.text} rounded-lg text-sm whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}
                >
                  {item.label}
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        <div className="absolute bottom-6 flex flex-col space-y-4">
          {[
            { icon: Github, href: 'https://github.com/HithxDevs' },
            { icon: Linkedin, href: 'https://linkedin.com/in/harshith-daraboina' },
            { icon: Mail, href: 'mailto:hithx.devs@gmail.com' }
          ].map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${theme.card} ${theme.textSecondary} hover:${theme.accent} hover:text-white transition-all duration-300`}
              >
                <Icon size={16} />
              </motion.a>
            );
          })}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="md:ml-20 pt-16 md:pt-0" ref={containerRef}>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-cyan-400"
                style={{
                  width: Math.random() * 10 + 5 + 'px',
                  height: Math.random() * 10 + 5 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [0, (Math.random() - 0.5) * 100],
                  x: [0, (Math.random() - 0.5) * 100],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6 border border-cyan-500/30"
                >
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                  Available for opportunities
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme.text} mb-6 leading-tight`}
                >
                  <span className="block">HARSHITH</span>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    DARABOINA
                  </span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h2 className={`text-xl sm:text-2xl md:text-3xl ${theme.text} font-light`}>
                    Full Stack Developer
                  </h2>
                  <h2 className={`text-xl sm:text-2xl md:text-3xl ${theme.textSecondary} font-light`}>
                    <span className="text-cyan-400">+</span> Machine Learning Engineer
                  </h2>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-base sm:text-lg ${theme.textSecondary} leading-relaxed max-w-lg mt-4`}
                >
                  I build exceptional digital experiences with modern web technologies and AI solutions. Currently pursuing Computer Science at IIIT Dharwad.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('projects')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Code size={18} />
                  View Projects
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://drive.google.com/file/d/1v7NILE8qWdu5BGPdD_6h7TrDVyM2erWN/view?usp=drive_link', '_blank')}
                  className={`px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500 ${theme.text} rounded-lg font-medium hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2`}
                >
                  <Download size={18} />
                  Download CV
                </motion.button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-4 sm:gap-6 pt-8"
              >
                {[
                  { number: '8.02', label: 'CGPA' },
                  { number: '10+', label: 'Projects' },
                  { number: '400+', label: 'LeetCode' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className={`text-xs sm:text-sm ${theme.textSecondary}`}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-blue-500/20"
                />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden backdrop-blur-sm border border-cyan-500/30 shadow-xl"
                >
                  <img 
                    src='/assets/hero.png' 
                    alt="Harshith Daraboina" 
                    className="w-full h-full object-cover rounded-full border-4 border-white/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={`py-16 sm:py-20 px-4 sm:px-8 ${theme.card}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-4`}>About Me</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 blur-lg"></div>
                  <img 
                    src='/assets/hero.png'  
                    alt="Harshith Daraboina" 
                    className="relative rounded-2xl w-full h-auto max-w-lg mx-auto border-4 border-white/10 shadow-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 order-1 lg:order-2"
              >
                <h3 className={`text-2xl font-bold ${theme.text}`}>
                  Crafting Digital Excellence Through Code
                </h3>
                <p className={`${theme.textSecondary} leading-relaxed`}>
                  As a passionate Computer Science student at IIIT Dharwad, I specialize in building robust full-stack applications and intelligent machine learning solutions. With a strong foundation in modern web technologies and AI algorithms, I create products that are both technically sound and user-centric.
                </p>
                <p className={`${theme.textSecondary} leading-relaxed`}>
                  My approach combines analytical problem-solving with creative design thinking, resulting in solutions that are not just functional but also delightful to use. I'm particularly interested in the intersection of AI and web technologies, where I can leverage both domains to build truly innovative products.
                </p>

                <div className="pt-6">
                  <h4 className={`text-lg font-semibold ${theme.text} mb-6`}>Core Competencies</h4>
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className={`font-medium ${theme.text}`}>{skill.name}</span>
                          <span className={`${theme.textSecondary}`}>{skill.level}%</span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full"
                          />
                        </div>
                        <div className={`text-xs ${theme.textSecondary} mt-1`}>
                          {skill.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 sm:py-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-4`}>Experience</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
            </motion.div>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${theme.card} p-6 sm:p-8 rounded-xl border ${theme.border} hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className={`text-xl font-bold ${theme.text} mb-1 sm:mb-2`}>{exp.position}</h3>
                      <h4 className="text-lg text-cyan-400 font-medium">{exp.company}</h4>
                    </div>
                    <div className={`${theme.textSecondary} font-medium mt-2 md:mt-0`}>{exp.period}</div>
                  </div>
                  <p className={`${theme.textSecondary} leading-relaxed mb-4 sm:mb-6`}>{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.achievements.map((achievement, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-xs sm:text-sm font-medium border border-cyan-500/30"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className={`py-16 sm:py-20 px-4 sm:px-8 ${theme.card}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-4`}>Featured Projects</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden border ${theme.border} hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 group`}
                >
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="text-white text-xl font-bold z-10 px-4 text-center">{project.title}</div>
                      <ExternalLink className="absolute top-4 right-4 text-white/80 group-hover:text-white transition-colors" size={20} />
                    </div>
                  </a>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-xl font-bold ${theme.text} group-hover:text-cyan-400 transition-colors`}>
                        {project.title}
                      </h3>
                      <span className={`text-sm ${theme.textSecondary}`}>{project.year}</span>
                    </div>
                    
                    <p className={`${theme.textSecondary} mb-4 leading-relaxed`}>{project.description}</p>
                    
                    {project.achievement && (
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium border border-green-500/30">
                          ✨ {project.achievement}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map(tech => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
                    >
                      View Project <ExternalLink className="ml-1" size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-4`}>Get In Touch</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
              <p className={`max-w-2xl mx-auto ${theme.textSecondary} mt-6`}>
                Have a project in mind or want to discuss opportunities? Feel free to reach out!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className={`p-6 sm:p-8 rounded-xl ${theme.card} border ${theme.border}`}>
                  <h3 className={`text-2xl font-bold ${theme.text} mb-6`}>Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${theme.accent} text-white`}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.text}`}>Email</h4>
                        <a href="mailto:hithx.devs@gmail.com" className={`${theme.textSecondary} hover:text-cyan-400 transition-colors`}>
                          hithx.devs@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${theme.accent} text-white`}>
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.text}`}>Phone</h4>
                        <a href="tel:+918639066100" className={`${theme.textSecondary} hover:text-cyan-400 transition-colors`}>
                          +91 8639066100
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${theme.accent} text-white`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.text}`}>Location</h4>
                        <p className={theme.textSecondary}>Dharwad, Karnataka, India</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h4 className={`font-medium ${theme.text} mb-4`}>Connect with me</h4>
                    <div className="flex gap-4">
                      {[
                        { icon: Github, href: 'https://github.com/HithxDevs' },
                        { icon: Linkedin, href: 'https://linkedin.com/in/harshith-daraboina' },
                        { icon: Mail, href: 'mailto:hithx.devs@gmail.com' }
                      ].map((social, index) => {
                        const Icon = social.icon;
                        return (
                          <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-full ${theme.card} ${theme.text} hover:${theme.accent} hover:text-white transition-all duration-300`}
                          >
                            <Icon size={20} />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-6 sm:p-8 rounded-xl ${theme.card} border ${theme.border}`}
              >
                <h3 className={`text-2xl font-bold ${theme.text} mb-6`}>Send Me a Message</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={`block ${theme.text} mb-2`}>Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={`block ${theme.text} mb-2`}>Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className={`block ${theme.text} mb-2`}>Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className={`block ${theme.text} mb-2`}>Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-4 ${theme.accent} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300`}
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 px-4 sm:px-8 border-t ${theme.border} ${theme.card}`}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className={`${theme.text} mb-4 md:mb-0 text-center md:text-left`}>
              © {new Date().getFullYear()} Harshith Daraboina. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {[
                { icon: Github, href: 'https://github.com/HithxDevs' },
                { icon: Linkedin, href: 'https://linkedin.com/in/harshith-daraboina' },
                { icon: Mail, href: 'mailto:hithx.devs@gmail.com' }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${theme.textSecondary} hover:text-cyan-400 transition-colors`}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CreativePortfolio;