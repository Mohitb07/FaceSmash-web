import React from 'react';
import User from '../User';

const UserRecommendation = () => {
  return (
    <>
      <div className="flex  items-center gap-5 mt-10">
        <User size="large" />
      </div>
      <div className="mt-5">
        <p className="text-xl text-gray-500 font-semibold">
          Suggestions for you
        </p>
        <div>
          <User />
          <User />
          <User />
          <User />
        </div>
      </div>
    </>
  );
};
export default UserRecommendation;
