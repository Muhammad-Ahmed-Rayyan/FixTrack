import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  handleNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'our-team', 'built-with', 'contact-us'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-brand">
        <img src="/logo/FixTrack.png" alt="Logo" className="navbar-logo" />
        <span className="logo">FixTrack</span>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className={`navbar-collapse ${isMenuOpen ? 'active' : ''}`}>
        <div className="navbar-links">
          <a href="#home" onClick={() => scrollToSection('home')} className={activeSection === 'home' ? 'active' : ''}>Home</a>
          <a href="#how-it-works" onClick={() => scrollToSection('how-it-works')} className={activeSection === 'how-it-works' ? 'active' : ''}>How It Works</a>
          <a href="#our-team" onClick={() => scrollToSection('our-team')} className={activeSection === 'our-team' ? 'active' : ''}>Our Team</a>
          <a href="#built-with" onClick={() => scrollToSection('built-with')} className={activeSection === 'built-with' ? 'active' : ''}>Built With</a>
          <a href="#contact-us" onClick={() => scrollToSection('contact-us')} className={activeSection === 'contact-us' ? 'active' : ''}>Contact</a>
        </div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={() => handleNavigate('/login')}>Login</button>
          <button className="nav-button signup" onClick={() => handleNavigate('/register')}>Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
