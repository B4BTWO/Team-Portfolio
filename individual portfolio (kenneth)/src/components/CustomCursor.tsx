import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const trailingPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, .project-card, .star-node-wrapper, .orbit-node, input, textarea');
      setIsHovered(!!clickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing ring loop
    let animId: number;
    const animate = () => {
      trailingPos.current.x += (position.x - trailingPos.current.x) * 0.15;
      trailingPos.current.y += (position.y - trailingPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [position.x, position.y]);

  return (
    <>
      <div
        className={`custom-cursor-dot ${isHovered ? 'hover' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? 'hover' : ''} ${isClicked ? 'clicked' : ''}`}
      />
    </>
  );
};

export default CustomCursor;
