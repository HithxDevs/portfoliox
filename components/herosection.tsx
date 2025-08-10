'use client';
import { motion } from 'framer-motion';
import { Code, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';

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

// Preload the UFO model
useGLTF.preload('/models/ufo.glb');

function UfoModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/ufo.glb');
  
  // Apply transformations to the model
  useEffect(() => {
    scene.scale.set(0.5, 0.5, 0.5);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    
    // Enhance materials for better visibility
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.7;
          child.material.roughness = 0.3;
          child.material.emissive = new THREE.Color(0x6366f1);
          child.material.emissiveIntensity = 0.5;
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (group.current) {
      const time = clock.getElapsedTime();
      // Circular flying path
      group.current.position.x = Math.sin(time * 0.5) * 5;
      group.current.position.y = Math.cos(time * 0.5) * 2 + 2;
      group.current.position.z = Math.cos(time * 0.5) * 3;
      // Gentle rotation
      group.current.rotation.y = time * 0.2;
    }
  });

  return <primitive object={scene} ref={group} {...props} />;
}

const Earth = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthMap = useLoader(THREE.TextureLoader, '/textures/earth/earthmap1k.jpg');
  
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
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
  );
};

export default function HeroSection({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const roles = ["DEVELOPER", "DESIGNER", "PROBLEM SOLVER"];
  const rolesColors = ["text-blue-500", "text-indigo-500", "text-cyan-500"];

  useEffect(() => {
    setMounted(true);
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

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
  }, [displayedText, isTyping, currentRoleIndex, mounted]);

  if (!mounted) {
    return (
      <div className={`min-h-[80vh] ${isDarkMode ? darkTheme.bg : lightTheme.bg}`}>
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
    <section 
      id="hero"
      className={`relative overflow-hidden min-h-[80vh] flex items-center ${theme.bg}`}
    >
      {/* Three.js Canvas - Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ antialias: true }}
          shadows
        >
          <ambientLight intensity={isDarkMode ? 0.5 : 0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} />
          <Earth isDarkMode={isDarkMode} />
          <UfoModel />
          {isDarkMode && (
            <Stars 
              radius={100} 
              depth={50} 
              count={3000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={0.5} 
            />
          )}
          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.3}
            enablePan={false}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl backdrop-blur-sm rounded-2xl p-8 lg:p-12"
          style={{
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            border: isDarkMode ? '1px solid rgba(31, 41, 55, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)'
          }}
        >
          <div className="space-y-6">
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme.text} leading-tight`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="block">Hi, I'm</span>
              <span className="block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Harshith <span className={theme.text}>Daraboina</span>
              </span>
            </motion.h1>
            
            <div className="h-16 flex items-center">
              <h2 className={`text-2xl sm:text-3xl font-medium ${rolesColors[currentRoleIndex]} font-mono`}>
                {displayedText}
                <span className="ml-1.5 animate-pulse">|</span>
              </h2>
            </div>

            <motion.p
              className={`${theme.textSecondary} text-lg`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              I craft digital experiences with clean code and thoughtful design.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                className={`px-6 py-3 ${theme.accent} text-white rounded-lg font-medium flex items-center gap-3 transition-colors hover:opacity-90`}
              >
                <Code size={18} />
                <span>View Projects</span>
              </button>
              
              <button
                className={`px-6 py-3 border ${theme.border} ${theme.text} rounded-lg font-medium flex items-center gap-3 backdrop-blur-sm transition-colors hover:bg-gray-100/10`}
              >
                <Download size={18} />
                <span>Download CV</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}