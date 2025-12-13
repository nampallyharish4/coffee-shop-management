import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <span className="loader-letter">C</span>
      <span className="loader-letter">L</span>
      <span className="loader-letter">O</span>
      <span className="loader-letter">U</span>
      <span className="loader-letter">D</span>
      <span className="loader-letter">&nbsp;</span>
      <span className="loader-letter">C</span>
      <span className="loader-letter">A</span>
      <span className="loader-letter">F</span>
      <span className="loader-letter">E</span>

      <div className="loader"></div>
    </div>
  );
};

export default Loader;
