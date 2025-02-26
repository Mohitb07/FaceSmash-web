import type { MouseEventHandler, ReactElement, ReactNode } from 'react';
import React from 'react';

type NavItemProp = {
  icon?: ReactElement;
  label: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>;
};

const NavItem: React.FC<NavItemProp> = ({ icon, label, onClick, children }) => {
  return children ? (
    <li onClick={onClick} className="nav-item group" aria-label={label}>
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
