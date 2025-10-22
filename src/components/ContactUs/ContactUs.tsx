
import React from 'react';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-us-container">
      <h2 className="section-title">Contact Us</h2>
      <div className="social-icons">
        <a href="https://github.com/Muhammad-Ahmed-Rayyan/FixTrack" className="social-icon"><i className="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/posts/sameer-ahmed-ai_fixtrack-civictech-ai-activity-7384722035773632512-ilEE" className="social-icon"><i className="fab fa-linkedin"></i></a>
        <a href="mailto:ahmedrayyanfamily@gmail.com" className="social-icon"><i className="fas fa-envelope"></i></a>
      </div>
    </div>
  );
};

export default ContactUs;
