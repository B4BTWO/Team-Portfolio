import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props { scrollProgress: number }

export function CosmicCanvas({ scrollProgress }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const progress = useRef(scrollProgress);

  useEffect(() => { progress.current = scrollProgress; }, [scrollProgress]);

  useEffect(() => {
    const element = mount.current;
    if (!element) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 220);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x030405, 1);
    element.appendChild(renderer.domElement);

    const starCount = 2400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const opacity = new Float32Array(starCount);
    for (let i = 0; i < starCount; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * 150;
      positions[index + 1] = (Math.random() - 0.5) * 100;
      positions[index + 2] = -95 + Math.random() * 125;
      sizes[i] = Math.random() < 0.055 ? 2.3 + Math.random() * 1.8 : 0.45 + Math.random() * 1.15;
      opacity[i] = 0.25 + Math.random() * 0.65;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacity, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * (190.0 / max(1.0, -viewPosition.z));
          vOpacity = aOpacity;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          vec2 point = gl_PointCoord - vec2(0.5);
          float falloff = 1.0 - smoothstep(0.12, 0.5, length(point));
          gl_FragColor = vec4(vec3(0.88, 0.92, 0.95), falloff * vOpacity);
        }
      `,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Timer();
    clock.connect(document);

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      clock.update();
      const elapsed = clock.getElapsed();
      const travel = reducedMotion ? 0 : progress.current;
      camera.position.z += (12 - travel * 20 - camera.position.z) * 0.035;
      camera.position.y += (-travel * 2.8 - camera.position.y) * 0.035;
      pointer.x += (pointer.targetX - pointer.x) * 0.025;
      pointer.y += (pointer.targetY - pointer.y) * 0.025;
      stars.rotation.y = reducedMotion ? 0 : pointer.x * 0.018 + Math.sin(elapsed * 0.035) * 0.006;
      stars.rotation.x = reducedMotion ? 0 : -pointer.y * 0.012 + Math.cos(elapsed * 0.025) * 0.004;
      renderer.render(scene, camera);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      clock.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (element.contains(renderer.domElement)) element.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="starfield-layer" ref={mount} aria-hidden="true" />;
}

export default CosmicCanvas;
