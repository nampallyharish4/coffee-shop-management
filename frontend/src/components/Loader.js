import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay" translate="no">
      <div className="loader-container">
        <div className="coffee-cup">
          <div className="smoke-container">
            <span className="smoke s1"></span>
            <span className="smoke s2"></span>
            <span className="smoke s3"></span>
          </div>
          <div className="cup-body"></div>
          <div className="cup-handle"></div>
          <div className="cup-saucer"></div>
        </div>
        <div className="loader-text">
          <span className="brand-name">CLOUD CAFE</span>
          <div className="loading-bar">
            <div className="progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
