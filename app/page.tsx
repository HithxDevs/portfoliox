'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Code, Mail, Github, Linkedin, Phone, MapPin, ExternalLink, Menu, X } from 'lucide-react';
import * as THREE from 'three';

const CreativePortfolio = () => {
  const [mounted, setMounted] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
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
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Three.js Earth-Focused Solar System
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
    renderer.setClearColor(isDarkMode ? 0x111111 : 0xf0f0f0, 0.7);
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
      color: isDarkMode ? 0xffffff : 0x1a1a1a,
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
      color: isDarkMode ? 0xffffff : 0x1a1a1a,
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
      color: isDarkMode ? 0xffffff : 0x1a1a1a,
      transparent: true,
      opacity: 0.9
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    
    // Add geometric wireframe overlay
    const earthWireframe = new THREE.Mesh(
      earthGeometry,
      new THREE.MeshBasicMaterial({
        color: isDarkMode ? 0xcccccc : 0x666666,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );
    earthGroup.add(earthWireframe);
    
    // Create geometric moon
    const moonGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const moonMaterial = new THREE.MeshLambertMaterial({
      color: isDarkMode ? 0xdddddd : 0x999999,
      transparent: true,
      opacity: 0.8
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(6, 0, 0);
    earthGroup.add(moon);
    
    // Create elegant moon orbit ring
    const moonOrbitGeometry = new THREE.RingGeometry(5.8, 6.2, 64);
    const moonOrbitMaterial = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0xffffff : 0x1a1a1a,
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
    
    const directionalLight = new THREE.DirectionalLight(isDarkMode ? 0xffffff : 0x555555, 0.8);
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

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form handling logic here
    console.log('Form submitted');
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
            className={`p-2 rounded-full ${theme.accent} text-white`}
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
          aria-label="Toggle theme"
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
      <div className="md:ml-20 pt-16 md:pt-0 relative z-10">
        {/* Hero Section */}
        <section id="home" className="relative z-10 pt-20 pb-40">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-32">
              <div className="mb-8">
                <p className={`text-sm tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>I BELIEVE THAT WHAT YOU WANT TO BECOME IN THE LIFE, IS WHAT ALL YOU NEED. </p>
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
                  <div className="relative w-full h-96 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <img 
                    src='/assets/hero.png'  
                    alt="Harshith Daraboina" 
                    className="relative rounded-2xl w-full h-auto max-w-lg mx-auto border-4 border-white/10 shadow-xl"
                  />
                  </div>
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
                  My approach combines analytical problem-solving with creative design thinking, resulting in solutions that are not just functional but also delightful to use. I&apos;m particularly interested in the intersection of AI and web technologies, where I can leverage both domains to build truly innovative products.
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
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={`block ${theme.text} mb-2`}>Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={`block ${theme.text} mb-2`}>Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
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
                      required
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className={`block ${theme.text} mb-2`}>Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      required
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

export default CreativePortfolio;