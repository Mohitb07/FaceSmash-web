import React from 'react';

type MainProps = {
  children: React.ReactNode;
  meta: React.ReactNode;
};

const Main: React.FC<MainProps> = ({ children, meta }) => {
  return (
    <div className="h-screen w-full bg-white px-1 text-gray-700 antialiased dark:bg-slate-800">
      {meta}
      <div>{children}</div>
    </div>
  );
};
export { Main };