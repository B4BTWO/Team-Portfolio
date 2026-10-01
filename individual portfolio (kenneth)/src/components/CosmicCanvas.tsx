import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmicCanvasProps {
  scrollProgress: number; // 0 to 1
  activeProjectIndex: number | null;
  onSelectProject: (index: number) => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  scrollProgress,
  activeProjectIndex,
  onSelectProject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const activeProjRef = useRef(activeProjectIndex);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    activeProjRef.current = activeProjectIndex;
  }, [activeProjectIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030308, 0.015);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030308, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 2.0);
    scene.add(ambientLight);

    // Sun light for cinematic Earth rim lighting
    const sunLight = new THREE.DirectionalLight(0xa5b4fc, 4.5);
    sunLight.position.set(12, 6, -8);
    scene.add(sunLight);

    const blueGlowLight = new THREE.PointLight(0x38bdf8, 3.0, 50);
    blueGlowLight.position.set(-6, -2, 2);
    scene.add(blueGlowLight);

    // --- 1. EARTH GROUP (SILHOUETTE & ATMOSPHERE) ---
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -1.8, 0.5); // Curved horizon silhouette in hero
    scene.add(earthGroup);

    // Earth Body (Deep Oceanic Dark Sphere with glowing continents)
    const earthGeo = new THREE.SphereGeometry(3.2, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x050c1e,
      roughness: 0.35,
      metalness: 0.8,
      emissive: 0x0b1f44,
      emissiveIntensity: 0.4,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Subtle grid/wireframe on earth for futuristic digital aesthetic
    const gridGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(3.22, 32, 24));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
    });
    const earthGrid = new THREE.LineSegments(gridGeo, gridMat);
    earthGroup.add(earthGrid);

    // Atmospheric Glow Outer Shell (Custom Fresnel Shader)
    const atmosphereGeo = new THREE.SphereGeometry(3.38, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.72 - dot(vNormal, viewDir), 2.8);
          vec3 atmosphereColor = mix(vec3(0.1, 0.4, 1.0), vec3(0.65, 0.2, 0.95), intensity);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.95);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Orbit Ring around Earth
    const orbitRingGeo = new THREE.RingGeometry(4.4, 4.43, 80);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI * 0.42;
    earthGroup.add(orbitRing);

    // --- 2. DEEP SPACE STARFIELD ---
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5b4fc),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xc084fc),
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      starColors[i3] = color.r;
      starColors[i3 + 1] = color.g;
      starColors[i3 + 2] = color.b;

      starSizes[i] = Math.random() * 2.2 + 0.6;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 3. CONSTELLATION PROJECT SYSTEM (INTERACTIVE) ---
    // 6 primary project star nodes with radiant pulses
    const projectNodesData = [
      { name: 'VIBE//TIX', pos: new THREE.Vector3(-3.2, 0.8, -12), color: 0x38bdf8 },
      { name: 'Bun & Bite', pos: new THREE.Vector3(2.8, 1.4, -14), color: 0xf43f5e },
      { name: 'Magnify Vision', pos: new THREE.Vector3(-1.8, -1.6, -16), color: 0xa855f7 },
      { name: 'AIRE Digital', pos: new THREE.Vector3(3.5, -1.2, -18), color: 0x10b981 },
      { name: 'NewDay Coaching', pos: new THREE.Vector3(-0.4, 2.6, -20), color: 0xf59e0b },
      { name: 'Sonix & Outride UI', pos: new THREE.Vector3(1.2, -2.8, -22), color: 0xec4899 },
    ];

    const projectGroup = new THREE.Group();
    scene.add(projectGroup);

    const projectNodeMeshes: THREE.Mesh[] = [];

    projectNodesData.forEach((node, idx) => {
      const nodeGeo = new THREE.SphereGeometry(0.28, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 1.8,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(node.pos);
      nodeMesh.userData = { index: idx, name: node.name };
      projectGroup.add(nodeMesh);
      projectNodeMeshes.push(nodeMesh);

      // Outer halo pulse ring
      const haloGeo = new THREE.RingGeometry(0.38, 0.45, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(node.pos);
      halo.lookAt(camera.position);
      projectGroup.add(halo);
    });

    // Dynamic Constellation connecting lines
    const lineIndices: number[] = [];
    // connect all neighboring star nodes to form an intricate constellation graph
    for (let i = 0; i < projectNodesData.length; i++) {
      for (let j = i + 1; j < projectNodesData.length; j++) {
        if (projectNodesData[i].pos.distanceTo(projectNodesData[j].pos) < 7.5) {
          lineIndices.push(i, j);
        }
      }
    }

    const linePoints: THREE.Vector3[] = [];
    lineIndices.forEach((idx) => {
      linePoints.push(projectNodesData[idx].pos);
    });

    const constellationGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const constellationMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });
    const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
    projectGroup.add(constellationLines);

    // --- 4. FLOATING CELESTIAL BODIES (SATURN / MOON / ANOMALIES) ---
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    // Planet Saturn-like with ring in the background
    const saturnGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const saturnMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x3b0764,
      roughness: 0.6,
    });
    const saturn = new THREE.Mesh(saturnGeo, saturnMat);
    saturn.position.set(-9, 5, -35);
    celestialGroup.add(saturn);

    const saturnRingGeo = new THREE.RingGeometry(2.2, 3.8, 48);
    const saturnRingMat = new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
    saturnRing.rotation.x = Math.PI * 0.55;
    saturnRing.rotation.y = Math.PI * 0.15;
    saturn.add(saturnRing);

    // Cyan glowing gas moon
    const moonGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      roughness: 0.5,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(10, -6, -42);
    celestialGroup.add(moon);

    // --- MOUSE PARALLAX & RAYCASTING ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseVector.x = mouse.targetX;
      mouseVector.y = mouse.targetY;

      // Raycast against project nodes
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(projectNodeMeshes);
      if (intersects.length > 0) {
        const hitIdx = intersects[0].object.userData.index;
        if (hitIdx !== undefined && onSelectProject) {
          onSelectProject(hitIdx);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const p = scrollRef.current; // 0 (top) to 1 (bottom)

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate Earth slowly
      earthGroup.rotation.y = elapsedTime * 0.06;
      earthGrid.rotation.y = -elapsedTime * 0.04;
      orbitRing.rotation.z = elapsedTime * 0.03;

      // Orbit and spin celestial objects
      saturn.rotation.y = elapsedTime * 0.04;
      moon.rotation.y = -elapsedTime * 0.05;

      // Starfield gentle cosmic drift
      starField.rotation.y = elapsedTime * 0.008;
      starField.rotation.x = Math.sin(elapsedTime * 0.005) * 0.02;

      // --- CINEMATIC CAMERA SCROLL FLYTHROUGH ---
      // In Hero (p = 0): Camera looks closely at Earth silhouette at (0, 0, 4.5)
      // As user scrolls: Camera flies backward, zooms out of Earth orbit into interstellar space
      const targetCamZ = THREE.MathUtils.lerp(4.5, -28.0, p);
      const targetCamY = THREE.MathUtils.lerp(0.0, 3.5, p);
      const targetCamX = THREE.MathUtils.lerp(0.0, -1.0, Math.sin(p * Math.PI));

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.x += (targetCamX - camera.position.x) * 0.08;

      // Parallax mouse tilt
      camera.rotation.y = -mouse.x * 0.08 + (p > 0.4 ? (p - 0.4) * 0.4 : 0);
      camera.rotation.x = mouse.y * 0.06;

      // As we scroll deep, Earth recedes into the background
      earthGroup.position.z = 0.5 - p * 35;
      earthGroup.position.y = -1.8 + p * 8;
      earthGroup.scale.setScalar(Math.max(0.2, 1.0 - p * 0.6));

      // Active project constellation highlight
      const activeIdx = activeProjRef.current;
      projectNodeMeshes.forEach((mesh, idx) => {
        const isSelected = activeIdx === idx;
        const targetScale = isSelected ? 1.8 : 1.0 + Math.sin(elapsedTime * 3 + idx) * 0.15;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isSelected ? 3.5 : 1.5;
      });

      // Constellation line glow pulse
      constellationMat.opacity = 0.25 + Math.sin(elapsedTime * 2) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectProject]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default CosmicCanvas;
