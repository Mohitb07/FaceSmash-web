import React from 'react';

type ButtonProps = {
  label: string;
  style?: string;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  leftIcon?: JSX.Element;
  position?: 'start' | 'center' | 'end';
};

const Button = ({
  label = '',
  onClick = () => {},
  disabled = false,
  leftIcon,
  position = 'center',
  style = '',
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={`justify-${position} flex items-center rounded-lg py-2 text-base font-semibold tracking-wide text-white ${
        disabled ? 'bg-primary-800' : 'bg-primary-100'
      } ${style}`}
    >
      {leftIcon && <span className="mx-5">{leftIcon}</span>}
      {label}
    </button>
  );
};
export default Button;
