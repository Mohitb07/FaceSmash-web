import Image from 'next/image';
import React from 'react';

type AvatarProps = {
  url: string;
  height?: number;
  width?: number;
  styles?: string
};

const Avatar = ({ url, height=30, width=30, styles = "" }: AvatarProps) => {
  return (
    <Image
      className={`rounded-full ${styles}`}
      src={url}
      height={height}
      width={width}
      alt="User Avatar"
    />
  );
};
export default Avatar;
