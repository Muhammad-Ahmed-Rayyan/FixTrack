
import React from 'react';
import './BuiltWith.css';

const BuiltWith: React.FC = () => {
  const technologies = [
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Vite', logo: 'https://www.svgrepo.com/show/374167/vite.svg' },
  ];

  return (
    <div className="built-with-container">
      <h2 className="section-title">Built With</h2>
      <div className="tech-grid">
        {technologies.map((tech, index) => (
          <div className="tech-card" key={index}>
            <img src={tech.logo} alt={tech.name} className="tech-logo" />
            <p className="tech-name">{tech.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuiltWith;
