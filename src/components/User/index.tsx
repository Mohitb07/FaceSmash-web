import React from 'react';
import Avatar from '../Avatar';

type UserProps = {
  size?: 'small' | 'large';
};

const User = ({ size = 'small' }: UserProps) => {
  let height,width, textSize;
  if(size === 'small'){
    height = 50
    width = 50
    textSize = 'lg'
  }
  if(size === "large"){
    height = 70
    width = 70
    textSize = 'xl'
  }
  return (
    <div className="flex items-center gap-5 mt-5">
      <Avatar
        url={
          'http://projects.websetters.in/digg-seos/digg/wp-content/themes/twentytwenty-child-theme/img/demo-prof.jpg'
        }
        height={height}
        width={width}
      />
      <div>
        <p className="font-semibold tracking-wide">mohitbisht1903</p>
        <p className={`text-${textSize} text-gray-500`}>Mohit Bisht</p>
      </div>
    </div>
  );
};
export default User;
