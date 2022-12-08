import Image from 'next/image';
import React from 'react';

type AvatarProps = {
  url: string;
  height?: number;
  width?: number;
};

const Avatar = ({ url, height=30, width=30 }: AvatarProps) => {
  return (
    <Image
      className="rounded-full"
      src={url}
      height={height}
      width={width}
      alt="User Avatar"
    />
  );
};
export default Avatar;
