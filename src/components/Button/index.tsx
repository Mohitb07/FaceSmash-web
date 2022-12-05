import React from 'react';

type ButtonProps = {
    label: string
    className?: string
};

const Button = ({label="", className = ""}: ButtonProps) => {
  return (
    <button className={`rounded-lg bg-primary-100 py-2 text-base font-semibold text-white ${className}`}>
      {label}
    </button>
  );
};
export default Button;
