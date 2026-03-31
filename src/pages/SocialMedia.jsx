// src/pages/SocialHTML.jsx
import React from 'react';
import { useEffect } from 'react';
import socialHTML from './social.html?raw';

const SocialHTML = () => {
  useEffect(() => {
  // Add vis class to all fi elements after a short delay
  setTimeout(() => {
    document.querySelectorAll('.fi').forEach(el => {
      el.classList.add('vis');
    });
  }, 100);
}, []);
  return (
    <div dangerouslySetInnerHTML={{ __html: socialHTML }} />
  );
};

export default SocialHTML;