import { useState, type CSSProperties } from 'react';

const points = [
  { label: 'EXPERIENCE', target: 'experience', x: 27, y: 24 },
  { label: 'ABOUT', target: 'about', x: 22, y: 62 },
  { label: 'SKILLS', target: 'stack', x: 43, y: 21 },
  { label: 'CONTACT', target: 'contact', x: 49, y: 49 },
  { label: 'APPROACH', target: 'approach', x: 68, y: 75 },
  { label: 'WORK', target: 'work', x: 70, y: 35 },
  { label: 'PORTFOLIO', target: 'work', x: 91, y: 50 },
];

const connections = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6]];

interface Props { onNavigate: (id: string) => void }

export function ConstellationNav({ onNavigate }: Props) {
  const [active, setActive] = useState<number | null>(null);

  return <nav className="opening-constellation" aria-label="Explore the portfolio">
    <svg className="opening-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {connections.map(([from, to]) => {
        const start = points[from]; const end = points[to];
        const lit = active === from || active === to;
        return <line key={`${from}-${to}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={lit ? 'connection-lit' : ''} />;
      })}
    </svg>
    {points.map((point, index) => <button
      type="button"
      key={point.label}
      className={`opening-star ${active === index ? 'opening-star-active' : ''}`}
      style={{ '--x': `${point.x}%`, '--y': `${point.y}%` } as CSSProperties}
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={() => setActive(null)}
      onClick={() => onNavigate(point.target)}
      aria-label={`Explore ${point.label.toLowerCase()}`}
    >
      <span className="opening-star-core" />
      <span className="opening-star-halo" />
      <span className="opening-star-label">{point.label}</span>
    </button>)}
  </nav>;
}

export default ConstellationNav;
