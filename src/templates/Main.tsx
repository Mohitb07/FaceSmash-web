import React from 'react';

type MainProps = {
  children: React.ReactNode;
  meta: React.ReactNode;
};

const Main: React.FC<MainProps> = ({ children, meta }) => {
  return (
    <div className="h-screen w-full text-gray-700 antialiased lg:px-4">
      {meta}
      <div>{children}</div>
    </div>
  );
};
export { Main };
