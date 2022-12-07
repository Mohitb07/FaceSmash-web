import Image from 'next/image';
import React from 'react';

type AvatarProps = {
  url: string;
};

const Avatar = ({ url }: AvatarProps) => {
  return (
    <Image
      className="rounded-full"
      src={url}
      height={30}
      width={30}
      alt="User Avatar"
    />
  );
};
export default Avatar;
