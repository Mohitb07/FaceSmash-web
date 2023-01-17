import Link from 'next/link';
import React from 'react';
import Avatar from '../Avatar';

type UserProps = {
  size?: 'small' | 'large';
  profileURL: string;
  username: string;
  email: string;
  userId: string;
};

const User = ({ size = 'small', profileURL, username, email, userId }: UserProps) => {
  let height, width, textSize;
  if (size === 'small') {
    height = 50;
    width = 50;
    textSize = 'lg';
  }
  if (size === 'large') {
    height = 70;
    width = 70;
    textSize = 'xl';
  }
  return (
    <Link href={`${username}?user_id=${userId}`}>
      <div className="flex items-center gap-5 mt-5 cursor-pointer">
        <Avatar url={profileURL} height={height} width={width} />
        <div>
          <p aria-label="email" className="font-semibold tracking-wide">
            {email}
          </p>
          <p aria-label="username" className={`text-${textSize} text-gray-500`}>
            {username}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default User;
