import { Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiLink } from 'react-icons/bi';

type FeedImageProps = {
  postImage: string;
  link?: string;
};

const FeedImage = ({ postImage, link }: FeedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paddingTop, setPaddingTop] = useState('0');

  const onImageLoad = ({ target }: { target: EventTarget }) => {
    const { naturalWidth, naturalHeight } = target as HTMLImageElement;
    setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`);
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'relative', paddingTop }}>
      <Image
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        alt="user post"
        src={postImage}
        layout="fill"
        objectFit="contain"
        priority
        onLoad={onImageLoad}
      />

      {isLoading && (
        <div className="flex h-[10rem] items-center justify-center">
          <Spinner />
        </div>
      )}
      {link && (
        <div className="absolute top-3 right-3 cursor-pointer rounded-full bg-slate-600 p-2 opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-80">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <BiLink fontSize={20} />
          </a>
        </div>
      )}
    </div>
  );
};
export default FeedImage;
