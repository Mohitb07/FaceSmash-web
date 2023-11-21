import React from 'react';

const Brand = ({ styles }: { styles?: string }) => {
  return (
    <h1
      className={`p-3 text-2xl font-bold text-white md:text-[2rem] ${styles}`}
    >
      <span className="text-primary-100">Face</span>Smash
    </h1>
  );
};
export default Brand;
