import React from 'react';

type InputProps = {
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  isError?: boolean;
  errorText?: string;
};

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  isError = false,
  errorText = "",
}) => {
  return (
    <div className='flex flex-col'>
      <input
        type={type}
        className={`rounded-md border ${
          isError ? 'border-red-700' : 'border-transparent'
        } bg-[#3D3D40] px-4 py-3 text-base text-white caret-white placeholder:text-[#8E8FAB] focus:outline-none`}
        placeholder={placeholder}
      />
      {isError && <span className="text-base ml-[1rem] text-red-500">{errorText}</span>}
    </div>
  );
};
export default Input;
