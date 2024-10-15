import React, { useState } from 'react';

interface DropDownMenuProps {
  title: string;
  children: React.ReactNode;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li
      className="dropdown-menu"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
      onClick={toggleMenu}
    >
      <button className="dropdown-button">{title}</button>
      {isOpen && <div className="dropdown-inner">{children}</div>}
      {/* <div className="dropdown-inner">{children}</div> */}
    </li>
  );
};

export default DropDownMenu;
