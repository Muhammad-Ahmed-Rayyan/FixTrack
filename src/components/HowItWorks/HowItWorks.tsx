
import React from 'react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  return (
    <div className="how-it-works-container">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-grid">
        <div className="step-card">
          <div className="step-icon">1</div>
          <h3 className="step-title">Report an Issue</h3>
          <p className="step-description">
          See something that needs fixing? Snap a photo or write a short description, then mark the exact location on the map it only takes a few seconds to make a difference.
          </p>
        </div>
        <div className="step-card">
          <div className="step-icon">2</div>
          <h3 className="step-title">Track Progress</h3>
          <p className="step-description">
          Stay informed as your report moves through the process. Get real-time updates when the issue is reviewed, assigned, and actively being resolved by the right team.
          </p>
        </div>
        <div className="step-card">
          <div className="step-icon">3</div>
          <h3 className="step-title">See Results</h3>
          <p className="step-description">
          Check the final status of your report and see how your contribution helped improve your area.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
