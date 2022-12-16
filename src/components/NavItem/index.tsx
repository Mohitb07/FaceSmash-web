import React, { MouseEventHandler, ReactElement, ReactNode } from 'react';

type NavItem = {
  icon?: ReactElement;
  label: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>
};

const NavItem: React.FC<NavItem> = ({ icon, label, onClick, children }) => {
  return children ? (
    <li onClick={onClick} className="nav-item group">
      {children}
      <span className="hidden lg:block">{label}</span>
    </li>
  ) : (
    <li onClick={onClick} className="nav-item group">
      {icon} <span className="hidden lg:block">{label}</span>
    </li>
  );
};
export default NavItem;
