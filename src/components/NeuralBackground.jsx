import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeuralBackground = ({ mousePos }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 800;

    // --- NEURAL NETWORK DATA ---
    const nodeCount = 180;
    const nodes = [];
    const nodeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const velocities = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 1500;
      const y = (Math.random() - 0.5) * 1500;
      const z = (Math.random() - 0.5) * 1500;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      nodes.push(new THREE.Vector3(x, y, z));
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ));
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Neural Nodes Material (Glowy Dots)
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const nodeSystem = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodeSystem);

    // --- SYNAPSES (LINES) ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });

    let lineSystem;

    // --- SIGNAL PULSES ---
    const pulseCount = 40;
    const pulseGeometry = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseSystem = new THREE.Points(pulseGeometry, new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    }));
    scene.add(pulseSystem);

    const activePulses = [];
    for(let i=0; i<pulseCount; i++) {
      activePulses.push({
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        startIndex: Math.floor(Math.random() * nodeCount),
        endIndex: Math.floor(Math.random() * nodeCount)
      });
    }

    // --- ANIMATION LOOP ---
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Update node positions
      const posArray = nodeGeometry.attributes.position.array;
      const linePositions = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes[i].add(velocities[i]);

        // Boundary bounce
        if (Math.abs(nodes[i].x) > 800) velocities[i].x *= -1;
        if (Math.abs(nodes[i].y) > 800) velocities[i].y *= -1;
        if (Math.abs(nodes[i].z) > 800) velocities[i].z *= -1;

        posArray[i * 3] = nodes[i].x;
        posArray[i * 3 + 1] = nodes[i].y;
        posArray[i * 3 + 2] = nodes[i].z;

        // Find neighbors for lines (limited for performance)
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodes[i].distanceTo(nodes[j]);
          if (dist < 250) {
            linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
            linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
          }
        }
      }
      nodeGeometry.attributes.position.needsUpdate = true;

      // Update Lines
      if (lineSystem) scene.remove(lineSystem);
      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineSystem = new THREE.LineSegments(lineGeom, lineMaterial);
      scene.add(lineSystem);

      // Update Pulses
      const pulseArray = pulseGeometry.attributes.position ? pulseGeometry.attributes.position.array : new Float32Array(pulseCount * 3);
      for(let i=0; i<pulseCount; i++) {
        const p = activePulses[i];
        p.progress += p.speed;
        
        if (p.progress >= 1) {
          p.progress = 0;
          p.startIndex = Math.floor(Math.random() * nodeCount);
          p.endIndex = Math.floor(Math.random() * nodeCount);
        }

        const start = nodes[p.startIndex];
        const end = nodes[p.endIndex];
        
        pulsePositions[i * 3] = start.x + (end.x - start.x) * p.progress;
        pulsePositions[i * 3 + 1] = start.y + (end.y - start.y) * p.progress;
        pulsePositions[i * 3 + 2] = start.z + (end.z - start.z) * p.progress;
      }
      pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));

      // Mouse Parallax
      const targetX = (mousePos.x - window.innerWidth / 2) * 0.15;
      const targetY = (mousePos.y - window.innerHeight / 2) * 0.15;
      scene.rotation.y += (targetX / 1000 - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetY / 1000 - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mousePos]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: '#000000'
      }}
    />
  );
};

export default NeuralBackground;
