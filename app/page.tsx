'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const ProfessionalPortfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ['start', 'end']
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const projects = [
    {
      id: 1,
      title: 'Enterprise Dashboard',
      description: 'Comprehensive analytics platform with real-time data visualization and advanced filtering capabilities.',
      technologies: ['React', 'TypeScript', 'D3.js', 'Node.js'],
      category: 'Web Application',
      year: '2024'
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
      technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS'],
      category: 'Full Stack',
      year: '2023'
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
      technologies: ['React Native', 'Firebase', 'Plaid API', 'Redux'],
      category: 'Mobile App',
      year: '2023'
    },
    {
      id: 4,
      title: 'AI Content Generator',
      description: 'Intelligent content creation tool leveraging machine learning for automated copywriting.',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      category: 'AI/ML',
      year: '2024'
    }
  ];

  const skills = [
    { name: 'Frontend Development', level: 95 },
    { name: 'Backend Development', level: 88 },
    { name: 'Mobile Development', level: 82 },
    { name: 'UI/UX Design', level: 90 },
    { name: 'DevOps & Cloud', level: 85 },
    { name: 'Database Management', level: 87 }
  ];

  const experience = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      period: '2022 - Present',
      description: 'Lead development of enterprise-level web applications serving 100K+ users. Mentor junior developers and drive technical architecture decisions.'
    },
    {
      company: 'Digital Innovations Ltd.',
      position: 'Frontend Developer',
      period: '2020 - 2022',
      description: 'Developed responsive web applications using modern JavaScript frameworks. Improved application performance by 40% through optimization techniques.'
    },
    {
      company: 'StartupX',
      position: 'Full Stack Developer',
      period: '2018 - 2020',
      description: 'Built MVP for fintech startup from ground up. Worked closely with product team to deliver features that increased user engagement by 60%.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden opacity-5 -z-10">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <Stars 
            radius={100} 
            depth={50} 
            count={2000} 
            factor={2} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
        </Canvas>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
        style={{ opacity: headerOpacity }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-xl font-bold text-gray-900"
          >
            Harshith Daraboina
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Experience', 'Projects', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.toLowerCase()
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <motion.button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`w-6 h-0.5 bg-gray-900 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-gray-900 my-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-gray-900 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-6 py-4 space-y-2">
                {['Home', 'About', 'Experience', 'Projects', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveSection(item.toLowerCase());
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Scrollable Content */}
      <div 
        ref={containerRef}
        className="overflow-y-auto"
      >
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  Available for new opportunities
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Hi, I'm{' '}
                  <span className="text-blue-600">Harshith Daraboina</span> 
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
                  Senior Full Stack Developer & UI/UX Designer
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  I create exceptional digital experiences through clean code and thoughtful design. 
                  With 6+ years of experience, I specialize in building scalable web applications 
                  that solve real-world problems.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View My Work
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Download CV
                </motion.button>
              </div>

              <div className="flex space-x-6">
                {['LinkedIn', 'GitHub', 'Twitter', 'Email'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200"
                  style={{ width: '350px', height: '350px' }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden"
                >
                  {/* Avatar placeholder */}
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-6xl font-bold">
                    HD
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Passionate about creating digital solutions
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I'm a seasoned full-stack developer with a passion for creating elegant, 
                  user-centered digital experiences. My journey in tech began with a Computer Science 
                  degree, and I've since worked with startups and enterprises to build products 
                  that make a difference.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I believe in the power of clean code, thoughtful design, and continuous learning. 
                  When I'm not coding, you'll find me exploring new technologies, contributing to 
                  open source projects, or mentoring aspiring developers.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">6+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">Projects Completed</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-blue-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </motion.div>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                      <h4 className="text-lg text-blue-600 font-medium">{exp.company}</h4>
                    </div>
                    <div className="text-gray-500 font-medium">{exp.period}</div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-lg font-medium">{project.title}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map(tech => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">{project.category}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
              <p className="text-gray-300 text-lg">
                I'm always interested in new opportunities and challenging projects.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <div>
                <h3 className="text-xl font-bold mb-6">Get in touch</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-300">Email</h4>
                    <p className="text-lg">hithx.devs@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Phone</h4>
                    <p className="text-lg">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-300">Location</h4>
                    <p className="text-lg">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Your name..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 bg-gray-900 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>© {new Date().getFullYear()} John Anderson. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProfessionalPortfolio;