import React from 'react';

const Brand = ({styles}: {styles?:string}) => {
  return (
    <h1 className={`text-[2rem] font-bold text-white ${styles}`}>
      <span className="text-primary-100">Face</span>Smash
    </h1>
  );
};
export default Brand;
