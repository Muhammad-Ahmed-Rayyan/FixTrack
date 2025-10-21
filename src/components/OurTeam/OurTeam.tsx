import React from 'react';
import './OurTeam.css';

const OurTeam: React.FC = () => {
  const teamMembers = [
    { name: 'Sameer Ahmed', role: 'Team Lead', img: '/assets/Sameer.png' },
    { name: 'Muhammad Ahmed Rayyan', role: 'Developer', img: '/assets/Rayyan.jpg' },
    { name: 'Haris Hussain', role: 'Developer', img: '/assets/Haris.png' },
    { name: 'Fawad Haider', role: 'Designer', img: '/assets/Fawad.jpg' },
    { name: 'Namish Binte Khurshid', role: 'Designer', img: '/assets/Namish.jpg' },
  ];

  const teamLead = teamMembers.find(member => member.role === 'Team Lead');
  const otherMembers = teamMembers.filter(member => member.role !== 'Team Lead');

  return (
    <div className="our-team-container">
      <h2 className="section-title">Our Team</h2>
      {teamLead && (
        <div className="team-grid-lead">
          <div className="team-member-card">
            <img src={teamLead.img} alt={teamLead.name} className="team-member-img" />
            <h3 className="team-member-name">{teamLead.name}</h3>
            <p className="team-member-role">{teamLead.role}</p>
          </div>
        </div>
      )}
      <div className="team-grid">
        {otherMembers.map((member, index) => (
          <div className="team-member-card" key={index}>
            <img src={member.img} alt={member.name} className="team-member-img" />
            <h3 className="team-member-name">{member.name}</h3>
            <p className="team-member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
