import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../animation/Map_Pinging.json';
import './Home.css';

interface HomeProps {
  handleNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ handleNavigate }) => {

  const handleScroll = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      <div className="lottie-background">
        <Lottie animationData={animationData} />
      </div>
      <div className="home-content">
        <h1 className="title">FixTrack</h1>
        <p className="subtitle">Report. Resolve. Improve.</p>
        <p className="description">
        Be the change your city needs. Report issues in seconds, track their resolution in real time, and help shape a more responsive, people-powered community
        </p>
        <div className="button-group">
          <button className="get-started-btn" onClick={() => handleNavigate('/register')}>
            Get Started
          </button>
          <button className="learn-more-btn" onClick={handleScroll}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
