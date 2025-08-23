'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Code, Mail, Github, Linkedin, Phone, MapPin, ExternalLink, Menu, X, FileText, Send } from 'lucide-react';
import * as THREE from 'three';
import emailjs from 'emailjs-com';

const ProfessionalPortfolio = () => {
  const [mounted, setMounted] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const scrollY = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  
  const roles = ["DEVELOPER", "DESIGNER", "PROBLEM SOLVER"];

  useEffect(() => {
    setMounted(true);
    // Initialize EmailJS with your public key
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
  }, []);

  // Fixed typing effect with proper cleanup
  useEffect(() => {
    if (!mounted) return;

    const currentRole = roles[currentRoleIndex];
    let timeout: NodeJS.Timeout | undefined;

    if (isTyping) {
      if (displayedText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
      } else {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [displayedText, isTyping, currentRoleIndex, mounted, roles]);

  // Handle scroll for section activation
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(documentHeight > 0 ? Math.min(scrollY.current / documentHeight, 1) : 0);
      
      // Section activation logic
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Three.js Earth-Focused Solar System - Updated for black and white theme
  useEffect(() => {
    if (!mounted || !containerRef.current || typeof window === 'undefined') return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(isDarkMode ? 0x000000 : 0xffffff, 0.7);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create minimalist stars background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 100 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      size: 0.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Create geometric sun
    const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      transparent: true,
      opacity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(60, 15, 60);
    scene.add(sun);
    
    // Create earth group
    const earthGroup = new THREE.Group();
    earthGroupRef.current = earthGroup;
    scene.add(earthGroup);
    
    // Create minimalist earth with geometric design
    const earthGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const earthMaterial = new THREE.MeshLambertMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      transparent: true,
      opacity: 0.9
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    
    // Add geometric wireframe overlay
    const earthWireframe = new THREE.Mesh(
      earthGeometry,
      new THREE.MeshBasicMaterial({
        color: isDarkMode ? 0xcccccc : 0x333333,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );
    earthGroup.add(earthWireframe);
    
    // Create geometric moon
    const moonGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const moonMaterial = new THREE.MeshLambertMaterial({
      color: isDarkMode ? 0xdddddd : 0x222222,
      transparent: true,
      opacity: 0.8
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(6, 0, 0);
    earthGroup.add(moon);
    
    // Create elegant moon orbit ring
    const moonOrbitGeometry = new THREE.RingGeometry(5.8, 6.2, 64);
    const moonOrbitMaterial = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
    moonOrbit.rotation.x = Math.PI / 2;
    earthGroup.add(moonOrbit);
    
    // Add sophisticated lighting
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x404040 : 0x808080, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(isDarkMode ? 0xffffff : 0x222222, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    // Initial camera position
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (earthGroup) {
        earthGroup.rotation.y = (event.clientX / window.innerWidth - 0.5) * 0.3;
        earthGroup.rotation.x = (event.clientY / window.innerHeight - 0.5) * 0.1;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate earth elegantly
      if (earthGroup) {
        earth.rotation.y += 0.003;
        earthWireframe.rotation.y += 0.0025;
        
        // Moon orbit
        moon.position.x = Math.cos(elapsedTime * 0.4) * 6;
        moon.position.z = Math.sin(elapsedTime * 0.4) * 6;
        moon.rotation.y += 0.002;
      }
      
      // Smooth camera movement based on scroll
      const scrollFactor = Math.min(scrollY.current * 0.0008, 1);
      camera.position.z = 12 - scrollFactor * 18;
      camera.position.y = 2 + scrollFactor * 8;
      camera.position.x = scrollFactor * 5;
      
      camera.lookAt(0, scrollFactor * 3, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (containerRef.current && renderer && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      // Dispose geometries and materials
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material?.dispose();
            }
          }
        });
      }
    };
  }, [mounted, isDarkMode]);

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

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Updated theme for black and white professional coding style
  const theme = isDarkMode ? {
    bg: 'bg-black',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    card: 'bg-gray-900',
    border: 'border-gray-800',
    accent: 'bg-white text-black',
    accentText: 'text-white',
    accentBorder: 'border-white'
  } : {
    bg: 'bg-white',
    text: 'text-black',
    textSecondary: 'text-gray-600',
    card: 'bg-gray-50',
    border: 'border-gray-200',
    accent: 'bg-black text-white',
    accentText: 'text-black',
    accentBorder: 'border-black'
  };

  // Handle form submission with EmailJS
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        form,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );
      
      setSubmitMessage({ type: 'success', text: 'Message sent successfully!' });
      form.reset();
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme.bg}`}>
      {/* Three.js container */}
      <div ref={containerRef} className="fixed inset-0 z-0" />
      
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 ${theme.card} backdrop-blur-md border-b ${theme.border}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${theme.accent}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>
          
          <h1 className={`text-xl font-bold ${theme.text}`}>Harshith Daraboina</h1>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-md ${theme.text}`}
            aria-label="Toggle menu"
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
                          ? `${theme.accent} ${theme.accentText}` 
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

      {/* Enhanced Desktop Navigation */}
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`hidden md:flex fixed left-0 top-0 h-screen w-24 z-50 flex-col items-center justify-between py-10 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md border-r ${theme.border}`}
      >
        <div className="flex flex-col items-center space-y-10">
          {/* Logo/Initials */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-lg">HD</span>
          </motion.div>
          
          {/* Navigation Items */}
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
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id 
                      ? `${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} shadow-lg` 
                      : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'}`
                  }`}
                >
                  <Icon size={20} />
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className={`absolute left-14 top-1/2 transform -translate-y-1/2 px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg text-sm whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}
                  >
                    {item.label}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Theme Toggle */}
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} transition-colors`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </motion.button>

          {/* Social Links */}
          <div className="flex flex-col space-y-4">
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
                  className={`p-2 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'} transition-all duration-300`}
                >
                  <Icon size={16} />
                </motion.a>
              );
            })}
          </div>

          {/* Resume Download */}
          <motion.a
            href="https://drive.google.com/file/d/1v7NILE8qWdu5BGPdD_6h7TrDVyM2erWN/view" 
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} flex items-center justify-center`}
          >
            <FileText size={16} />
          </motion.a>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="md:ml-24 pt-16 md:pt-0 relative z-10">
        {/* Hero Section */}
        <section id="home" className="relative z-10 pt-20 pb-40">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-32">
              <div className="mb-8">
                <p className={`text-sm tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>I BELIEVE THAT WHAT YOU WANT TO BECOME IN THE LIFE, IS WHAT ALL YOU NEED. </p>
                <h1 className={`text-6xl md:text-8xl font-light leading-tight ${theme.text} mb-8`}>
                  HARSHITH<br />
                  <span className="text-4xl md:text-6xl">DARABOINA</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-8 mb-12">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                </div>
                <span className={`text-sm tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Know more about us →</span>
              </div>

              {/* Typing Effect Display */}
              <div className="mb-8">
                <div className={`text-2xl font-mono tracking-wider ${theme.text}`}>
                  {displayedText}
                  <span className="animate-pulse ml-1">|</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`py-20 px-4 sm:px-8 ${theme.bg}`}>
          <div className="max-w-7xl mx-auto">
            {/* Main Content - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Glowing background effect */}
                <div className="absolute -inset-6 bg-gradient-to-r from-gray-400/10 to-gray-600/10 rounded-3xl blur-3xl"></div>
                
                {/* Image container */}
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                    <img 
                      src='/assets/hero.png'  
                      alt="Harshith Daraboina" 
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Main Heading with Outline Effect */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-400 mb-2">
                    We craft digital experiences and see the world through a
                  </h2>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className={`${theme.text} block`}>lens of innovation</span>
                    <span 
                      className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600"
                      style={{
                        WebkitTextStroke: isDarkMode ? '2px rgba(255,255,255,0.3)' : '2px rgba(0,0,0,0.3)',
                        textShadow: '0 0 30px rgba(100, 100, 100, 0.3)'
                      }}
                    >
                      and excellence
                    </span>
                  </h1>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <p className={`text-lg ${theme.textSecondary} leading-relaxed max-w-xl`}>
                    As a passionate Computer Science student at IIIT Dharwad, I specialize in building robust full-stack applications and intelligent machine learning solutions.
                  </p>
                  
                  <p className={`text-lg ${theme.textSecondary} leading-relaxed max-w-xl`}>
                    My approach combines analytical problem-solving with creative design thinking, resulting in solutions that are not just functional but also delightful to use.
                  </p>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="pt-4"
                >
                  <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-black text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105">
                    <span>Know more about me</span>
                    <svg 
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </motion.div>

                {/* Skills Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="pt-8"
                >
                  <div className="flex flex-wrap gap-3">
                    {['React', 'Python', 'AI/ML', 'Node.js', 'Cloud'].map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                        className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-full text-sm font-medium ${theme.text} hover:border-gray-400 transition-colors`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
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
              <div className="w-20 h-1 bg-gradient-to-r from-gray-700 to-black mx-auto"></div>
            </motion.div>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${theme.card} p-6 sm:p-8 rounded-xl border ${theme.border} hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className={`text-xl font-bold ${theme.text} mb-1 sm:mb-2`}>{exp.position}</h3>
                      <h4 className="text-lg text-gray-400 font-medium">{exp.company}</h4>
                    </div>
                    <div className={`${theme.textSecondary} font-medium mt-2 md:mt-0`}>{exp.period}</div>
                  </div>
                  <p className={`${theme.textSecondary} leading-relaxed mb-4 sm:mb-6`}>{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.achievements.map((achievement, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-gradient-to-r from-gray-700/20 to-black/20 text-gray-400 rounded-full text-xs sm:text-sm font-medium border border-gray-700/30"
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
<section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-white overflow-hidden">
  {/* Sophisticated Grid Background */}
  <div className="absolute inset-0">
    {/* Primary grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), 
                       linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
      backgroundSize: '50px 50px'
    }}></div>
    
    {/* Accent grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), 
                       linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
      backgroundSize: '200px 200px'
    }}></div>
    
    {/* Floating geometric elements */}
    <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-slate-200/40 to-gray-200/30 rounded-full blur-2xl"></div>
    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-gray-100/50 to-slate-200/30 rounded-full blur-xl"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
    {/* Header Section */}
    <motion.div
      className="text-center mb-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="inline-block mb-8">
        <motion.div
          className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Software Engineering Excellence
        </motion.div>
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          DIGITAL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 font-extralight italic">
            ARCHITECTURE
          </span>
        </motion.h1>
        <motion.div
          className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        ></motion.div>
      </div>
    </motion.div>

    {/* Innovation Metrics */}
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8, duration: 1 }}
    >
      {[
        { value: "500K+", metric: "Lines of Code", description: "Production-ready software" },
        { value: "99.9%", metric: "Uptime", description: "Mission-critical systems" },
        { value: "50ms", metric: "Response Time", description: "Optimized performance" },
        { value: "Zero", metric: "Security Breaches", description: "Bulletproof architecture" }
      ].map((item, index) => (
        <motion.div
          key={index}
          className="text-center group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
          whileHover={{ y: -10 }}
        >
          <div className="relative">
            <motion.div
              className="text-4xl md:text-5xl font-extralight text-gray-900 mb-2"
              whileHover={{ scale: 1.1 }}
            >
              {item.value}
            </motion.div>
            <div className="text-sm text-gray-700 font-medium mb-2">{item.metric}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gray-800 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* Project Showcase */}
    <motion.div
      className="mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Featured Solutions</h2>
        <div className="w-16 h-px bg-gray-800 mx-auto"></div>
      </div>

      <div className="space-y-12">
        {[
          {
            id: "01",
            title: "Quantum Trading Engine",
            category: "FinTech Infrastructure",
            description: "High-frequency trading system processing 1M+ transactions per second with microsecond latency optimization.",
            technologies: ["Rust", "WebAssembly", "gRPC", "Redis Cluster"],
            metrics: { performance: "1M TPS", latency: "<50μs", accuracy: "99.99%" },
            codePreview: `// Ultra-low latency order matching
use tokio::time::Instant;
async fn match_order(order: Order) -> Result<Trade> {
    let start = Instant::now();
    let result = engine.match_atomic(order).await?;
    metrics.record_latency(start.elapsed());
    Ok(result)
}`
          },
          {
            id: "02",
            title: "Neural Vision Pipeline",
            category: "AI/ML Platform",
            description: "Real-time computer vision system with edge computing capabilities for autonomous vehicle navigation.",
            technologies: ["TensorFlow", "CUDA", "OpenCV", "Kubernetes"],
            metrics: { accuracy: "98.7%", processing: "60 FPS", efficiency: "90% GPU" },
            codePreview: `# Multi-scale object detection
class NeuralVision:
    def __init__(self, model_path):
        self.model = tf.saved_model.load(model_path)
        self.preprocessor = VisionPreprocessor()
    
    @tf.function
    def detect_objects(self, frame):
        processed = self.preprocessor.normalize(frame)
        return self.model(processed)`
          },
          {
            id: "03",
            title: "Distributed Ledger Core",
            category: "Blockchain Technology",
            description: "Enterprise-grade blockchain infrastructure with custom consensus algorithm and smart contract execution.",
            technologies: ["Go", "IPFS", "PostgreSQL", "Docker Swarm"],
            metrics: { throughput: "10K TPS", nodes: "1000+", consensus: "<2s" },
            codePreview: `// Consensus algorithm implementation
type ConsensusEngine struct {
    validators []Validator
    threshold  float64
}

func (c *ConsensusEngine) ProposeBlock(block *Block) error {
    votes := c.collectVotes(block)
    if votes.approval >= c.threshold {
        return c.commitBlock(block)
    }
    return ErrConsensusNotReached
}`
          }
        ].map((project, index) => (
          <motion.div
            key={project.id}
            className="group relative"
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.3, duration: 1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Project Info */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="space-y-6">
                  <div>
                    <div className="text-6xl font-extralight text-gray-300 mb-2">{project.id}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-3">{project.category}</div>
                    <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">{project.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-light text-gray-900">{value}</div>
                        <div className="text-xs text-gray-600 uppercase">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 border border-gray-400 text-gray-700 text-xs font-medium rounded-full hover:border-gray-600 hover:bg-gray-50 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 group-hover:border-gray-300 hover:shadow-xl transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono">production.rs</div>
                  </div>

                  {/* Code */}
                  <div className="font-mono text-sm">
                    <pre className="text-gray-800 leading-relaxed overflow-x-auto">
                      <code>{project.codePreview}</code>
                    </pre>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </div>
            </div>

            {/* Project Divider */}
            {index < 2 && (
              <motion.div
                className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-24"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
              ></motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Technologies Stack */}
    <motion.div
      className="mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Technology Expertise</h2>
        <div className="w-16 h-px bg-gray-800 mx-auto"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {[
          "TypeScript", "Rust", "Go", "Python", "React", "Next.js",
          "Node.js", "PostgreSQL", "Redis", "Kubernetes", "AWS", "Docker",
          "TensorFlow", "WebAssembly", "GraphQL", "gRPC", "Blockchain", "WebGL"
        ].map((tech, index) => (
          <motion.div
            key={tech}
            className="group text-center cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-white/70 border border-gray-200 rounded-2xl flex items-center justify-center group-hover:border-gray-400 hover:shadow-lg transition-all">
              <div className="text-2xl text-gray-600 group-hover:text-gray-900 transition-colors">
                {tech.charAt(0)}
              </div>
            </div>
            <div className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
              {tech}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* CTA Section */}
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <motion.button
        className="group relative inline-flex items-center justify-center px-12 py-4 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 tracking-wider uppercase">Explore Architecture</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </motion.button>
      
      <p className="text-gray-600 text-sm mt-8 max-w-md mx-auto">
        Building tomorrow's software infrastructure today. Every line of code crafted with precision and purpose.
      </p>
    </motion.div>
  </div>

  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(-20px, -20px) rotate(1deg); }
      66% { transform: translate(20px, -10px) rotate(-1deg); }
    }
  `}</style>
</section>

        {/* Skills Section */}
        {/* <section className="py-16 sm:py-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-4`}>Skills</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gray-700 to-black mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className={`font-medium ${theme.text}`}>{skill.name}</h3>
                    <span className={`text-sm ${theme.textSecondary}`}>{skill.level}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-gray-700 to-black"
                    />
                  </div>
                  <p className={`text-sm ${theme.textSecondary}`}>{skill.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

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
              <div className="w-20 h-1 bg-gradient-to-r from-gray-700 to-black mx-auto"></div>
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
                      <div className={`p-3 rounded-full ${theme.accent}`}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.text}`}>Email</h4>
                        <a href="mailto:hithx.devs@gmail.com" className={`${theme.textSecondary} hover:text-gray-400 transition-colors`}>
                          hithx.devs@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${theme.accent}`}>
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.text}`}>Phone</h4>
                        <a href="tel:+918639066100" className={`${theme.textSecondary} hover:text-gray-400 transition-colors`}>
                          +91 8639066100
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${theme.accent}`}>
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
                            className={`p-3 rounded-full ${theme.card} ${theme.text} hover:${theme.accent} hover:${theme.accentText} transition-all duration-300`}
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
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={`block ${theme.text} mb-2`}>Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        required
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-500`}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={`block ${theme.text} mb-2`}>Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        required
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-500`}
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className={`block ${theme.text} mb-2`}>Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      required
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-500`}
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className={`block ${theme.text} mb-2`}>Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={5}
                      required
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-gray-500`}
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  {submitMessage.text && (
                    <div className={`p-3 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                      {submitMessage.text}
                    </div>
                  )}
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-4 ${theme.accent} ${theme.accentText} rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
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
                    className={`${theme.textSecondary} hover:text-gray-400 transition-colors`}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom Instructions */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`px-6 py-3 rounded-full shadow-lg border ${theme.border} ${theme.card}`}>
          <span className={`text-xs tracking-wider ${theme.textSecondary}`}>
            SCROLL TO ORBIT • MOVE TO ROTATE
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPortfolio;