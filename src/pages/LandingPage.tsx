import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Home from '../components/Home/Home';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import OurTeam from '../components/OurTeam/OurTeam';
import BuiltWith from '../components/BuiltWith/BuiltWith';
import ContactUs from '../components/ContactUs/ContactUs';
import Footer from '../components/Footer/Footer';
import './LandingPage.css';

interface LandingPageProps {
  handleNavigate: (path: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ handleNavigate }) => {
  return (
    <div className="landing-page">
      <Navbar handleNavigate={handleNavigate} />
      <main>
        <section id="home">
          <Home handleNavigate={handleNavigate} />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="our-team">
          <OurTeam />
        </section>
        <section id="built-with">
          <BuiltWith />
        </section>
        <section id="contact-us">
          <ContactUs />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
