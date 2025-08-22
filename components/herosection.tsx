import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FlyingSaucerSolarSystem() {
  const [mounted, setMounted] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const earthGroupRef = useRef(null);
  const scrollY = useRef(0);

  const roles = ["DEVELOPER", "DESIGNER", "PROBLEM SOLVER"];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentRole = roles[currentRoleIndex];
    let timeout;

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

  // Three.js Earth-Focused Solar System
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8f8f8, 1);
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
      color: 0x1a1a1a,
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
      color: 0x1a1a1a,
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
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.9
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    
    // Add geometric wireframe overlay
    const earthWireframe = new THREE.Mesh(
      earthGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x666666,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
    );
    earthGroup.add(earthWireframe);
    
    // Create geometric moon
    const moonGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const moonMaterial = new THREE.MeshLambertMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.8
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(6, 0, 0);
    earthGroup.add(moon);
    
    // Create elegant moon orbit ring
    const moonOrbitGeometry = new THREE.RingGeometry(5.8, 6.2, 64);
    const moonOrbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
    moonOrbit.rotation.x = Math.PI / 2;
    earthGroup.add(moonOrbit);
    
    // Add sophisticated lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    // Initial camera position
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);
    
    // Handle scroll
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      if (earthGroup) {
        earthGroup.rotation.y = (event.clientX / window.innerWidth - 0.5) * 0.3;
        earthGroup.rotation.x = (event.clientY / window.innerHeight - 0.5) * 0.1;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && renderer && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [mounted]);

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
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#f8f8f8' }}>
      {/* Three.js container */}
      <div ref={containerRef} className="fixed inset-0 z-0" />
      
      {/* Header Navigation */}
      <header className="relative z-20 flex justify-between items-center p-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
          </div>
          <span className="text-lg font-medium tracking-wider text-black">FLYING SAUCER</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-gray-600">
          <a href="#" className="hover:text-black transition-colors">WORK</a>
          <a href="#" className="hover:text-black transition-colors">ABOUT</a>
          <a href="#" className="hover:text-black transition-colors">CONTACT</a>
        </nav>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-40">
        <div className="max-w-6xl mx-auto px-8">
          {/* Hero Section */}
          <div className="mb-32">
            <div className="mb-8">
              <p className="text-sm tracking-widest text-gray-500 mb-4">I BELIEVE THAT WHAT YOU WANT TO BECOME IN THE LIFE, IS WHAT ALL YOU NEED. </p>
              <h1 className="text-6xl md:text-8xl font-light leading-tight text-black mb-8">
                HARSHITH<br />
                <span className="text-4xl md:text-6xl">DARABOINA</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-8 mb-12">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
              <span className="text-sm tracking-wider text-gray-500">Know more about us →</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Instructions */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
          <span className="text-xs tracking-wider text-gray-500">
            SCROLL TO ORBIT • MOVE TO ROTATE
          </span>
        </div>
      </div>
    </div>
  );
}