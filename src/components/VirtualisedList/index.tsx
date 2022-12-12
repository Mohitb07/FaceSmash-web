import React from 'react';
import Feed from '../Feed';

const VirtualisedList = () => {
  return (
    <>
      <Feed />
      <Feed />
      <Feed />
      <Feed />
      <>
        <p className="text-center text-gray-500">End Of Result</p>
      </>
    </>
  );
};
export default VirtualisedList;
