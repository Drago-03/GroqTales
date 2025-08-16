'use client';

import React, { useEffect, useState } from 'react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-1 rounded-full bg-gradient-to-r from-primary via-blue-500 to-purple-500  shadow-lg transition-all duration-300 hover:bg-primary/90 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
      }`}
      aria-label="Back to Top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="white"
        viewBox="0 0 24 24"
        className='pt-1'
      >
        <path d="M12 5.5l-6.5 6.5 1.4 1.4L12 8.3l5.1 5.1 1.4-1.4L12 5.5z" />
      </svg>
    </button>
  );
};

export default BackToTop;
