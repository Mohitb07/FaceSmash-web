import React from 'react';

type ButtonProps = {
  label: string;
  style?: string;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({
  label = '',
  onClick = () => {},
  disabled = false,
  style = '',
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg py-2 text-base font-semibold text-white ${
        disabled ? 'bg-primary-800' : 'bg-primary-100'
      } ${style}`}
    >
      {label}
    </button>
  );
};
export default Button;
