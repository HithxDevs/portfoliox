'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Code, Download, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

type Theme = {
  bg: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  card: string;
};

const darkTheme: Theme = {
  bg: 'bg-gray-950',
  text: 'text-gray-100',
  textSecondary: 'text-gray-400',
  accent: 'bg-gradient-to-r from-blue-600 to-indigo-600',
  border: 'border-gray-800',
  card: 'bg-gray-900/80'
};

const lightTheme: Theme = {
  bg: 'bg-gray-50',
  text: 'text-gray-900',
  textSecondary: 'text-gray-600',
  accent: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  border: 'border-gray-200',
  card: 'bg-white/80'
};

const Earth = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const earthMap = useLoader(THREE.TextureLoader, '/textures/earth/earthmap1k.jpg');
  
  useFrame(({ clock, mouse }) => {
    if (earthRef.current && groupRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.x * 0.5,
        0.05
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -mouse.y * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial 
          map={earthMap}
          metalness={0.2}
          roughness={0.7}
          emissive={isDarkMode ? new THREE.Color(0x1e3a8a) : new THREE.Color(0x93c5fd)}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.85, 64, 64]} />
        <meshBasicMaterial
          color={isDarkMode ? new THREE.Color(0x3b82f6) : new THREE.Color(0x60a5fa)}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default function HeroSection({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorScale = useTransform(cursorX, [0, window.innerWidth], [0.9, 1.1]);
  const cursorOpacity = useTransform(cursorY, [0, window.innerHeight], [0.8, 1]);

  const roles = ["DEVELOPER", "DESIGNER", "PROBLEM SOLVER"];
  const rolesColors = ["text-blue-500", "text-indigo-500", "text-cyan-500"];

  useEffect(() => {
    setMounted(true);
    setTheme(isDarkMode ? darkTheme : lightTheme);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8); // Adjust for cursor size
      cursorY.set(e.clientY - 8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDarkMode, cursorX, cursorY]);

  useEffect(() => {
    if (!mounted) return;

    const currentRole = roles[currentRoleIndex];
    let timeout: NodeJS.Timeout;

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

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentRoleIndex, roles, mounted]);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${isDarkMode ? darkTheme.bg : lightTheme.bg}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">
            <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-48 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen ${theme.bg} relative overflow-hidden`}
    >
      {/* Three.js Canvas - Right Side */}
      <div className="fixed inset-0 z-0 lg:left-auto lg:right-0 lg:w-1/2">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={isDarkMode ? 0.4 : 0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <directionalLight position={[-5, 5, 5]} intensity={0.6} />
          <Earth isDarkMode={isDarkMode} />
          <Stars 
            radius={100} 
            depth={50} 
            count={isDarkMode ? 3000 : 1500} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.3}
            enablePan={false}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Subtle Grid Background */}
      <div className={`absolute inset-0 z-0 opacity-10 ${isDarkMode ? 'bg-grid-white/[0.05]' : 'bg-grid-gray-900/[0.05]'}`}></div>

      {/* Main Content - Left Side */}
      <section className="min-h-screen flex items-center justify-start px-6 sm:px-12 py-20 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 backdrop-blur-sm rounded-2xl p-8 lg:p-12"
              style={{
                backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                border: isDarkMode ? '1px solid rgba(31, 41, 55, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)'
              }}
            >
              {/* Headings */}
              <div className="space-y-6">
                <motion.h1 
                  className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme.text} leading-tight`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="block">Hi, I'm</span>
                  <span className="block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Harshith
                  </span>
                </motion.h1>
                
                {/* Animated Role */}
                <motion.div
                  className="h-16 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className={`text-2xl sm:text-3xl font-medium ${rolesColors[currentRoleIndex]} font-mono flex items-center`}>
                    <motion.span
                      className="inline-block"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 300,
                        damping: 10,
                      }}
                      key={currentRoleIndex}
                    >
                      {displayedText}
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-1.5"
                    >
                      |
                    </motion.span>
                  </h2>
                </motion.div>

                <motion.p
                  className={`${theme.textSecondary} text-lg max-w-lg`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  I craft digital experiences with clean code and thoughtful design.
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: isDarkMode ? '0 0 15px rgba(59, 130, 246, 0.4)' : '0 0 15px rgba(59, 130, 246, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 ${theme.accent} text-white rounded-lg font-medium flex items-center gap-3 transition-all`}
                >
                  <Code size={18} />
                  <span>View Projects</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: isDarkMode ? '0 0 15px rgba(255, 255, 255, 0.1)' : '0 0 15px rgba(0, 0, 0, 0.05)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 border ${theme.border} ${theme.text} rounded-lg font-medium flex items-center gap-3 backdrop-blur-sm transition-all`}
                >
                  <Download size={18} />
                  <span>Download CV</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Empty div for right side (Earth will overlay this) */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Cursor Follower */}
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-blue-500/20 pointer-events-none z-20 mix-blend-exclusion"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
          opacity: cursorOpacity
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}