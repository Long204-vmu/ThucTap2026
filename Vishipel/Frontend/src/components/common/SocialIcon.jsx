import React, { useState } from 'react';

const SocialIcon = ({ href, icon, hoverColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? hoverColor : 'rgba(255,255,255,0.7)',
        fontSize: 18,
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icon}
    </a>
  );
};

export default SocialIcon;