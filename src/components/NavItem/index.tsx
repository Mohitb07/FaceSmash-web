import type { MouseEventHandler, ReactElement, ReactNode } from 'react';
import React from 'react';

type NavItemProp = {
  icon?: ReactElement;
  label: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>;
  isActive?: boolean;
};

const NavItem: React.FC<NavItemProp> = ({
  icon,
  label,
  onClick,
  children,
  isActive = false,
}) => {
  return children ? (
    <li
      onClick={onClick}
      className={`nav-item group ${
        isActive ? 'bg-zinc-800/90 font-bold text-white shadow-sm' : ''
      }`}
      aria-label={label}
    >
      {children}
      <span className="hidden lg:block">{label}</span>
    </li>
  ) : (
    <li
      onClick={onClick}
      className={`nav-item group ${
        isActive ? 'bg-zinc-800/90 font-bold text-white shadow-sm' : ''
      }`}
    >
      {icon} <span className="hidden lg:block">{label}</span>
    </li>
  );
};
export default NavItem;
