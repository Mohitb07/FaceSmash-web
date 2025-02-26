import React from 'react';

const Brand = ({ styles }: { styles?: string }) => {
  return (
    <h1
      className={`text-2xl font-bold text-white md:text-4xl ${styles} brand-name py-2`}
    >
      <span className="text-primary-100">face</span>Smash
    </h1>
  );
};
export default Brand;
