import React from 'react';

interface CelestialNavProps {
  currentSection: number;
  onNavigate: (sectionIndex: number) => void;
}

export const CelestialNav: React.FC<CelestialNavProps> = ({ currentSection, onNavigate }) => {
  const planets = [
    { name: 'ORIGIN', tag: '01', desc: 'Earth Horizon / Hero' },
    { name: 'IDENTITY', tag: '02', desc: 'Fullstack Philosophy' },
    { name: 'CONSTELLATIONS', tag: '03', desc: 'Selected Projects' },
    { name: 'TECH MATRIX', tag: '04', desc: 'Cosmic Arsenal' },
    { name: 'TRANSMISSION', tag: '05', desc: 'Direct Comm / Contact' },
  ];

  return (
    <nav className="celestial-orbit-nav" aria-label="Celestial Orbital Navigation">
      <div className="orbit-axis-line" />
      {planets.map((planet, idx) => {
        const isActive = currentSection === idx;
        return (
          <button
            key={planet.name}
            className={`orbit-node ${isActive ? 'is-active' : ''}`}
            onClick={() => onNavigate(idx)}
            aria-label={`Jump to orbital sector ${planet.name}`}
          >
            <div className="orbit-planet-body">
              <div className="orbit-planet-ring" />
              <div className="orbit-planet-core" />
            </div>
            <div className="orbit-meta">
              <span className="mono sector-id">ORBIT // {planet.tag}</span>
              <span className="sector-title">{planet.name}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default CelestialNav;
