'use client';

import React, { useState } from 'react';

interface DropDownMenuProps {
  title: string;
  classes?: string;
  buttonClasses?: string;
  children: React.ReactNode;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  title,
  classes,
  buttonClasses,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li
      className={`dropdown-menu ${classes ? classes : ''}`}
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
      onClick={toggleMenu}
    >
      <button
        className={`dropdown-button ${buttonClasses ? buttonClasses : ''}`}
      >
        {title}
      </button>
      {isOpen && <div className="dropdown-inner">{children}</div>}
      {/* <div className="dropdown-inner">{children}</div> */}
    </li>
  );
};

export default DropDownMenu;
