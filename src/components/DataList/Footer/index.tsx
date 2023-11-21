import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import React from 'react';

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="max-w-2xl flex-1 space-y-10">
        <div className="w-full space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
        <div className="w-full space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
      </div>
    );
  }

  return null;
};
export default Footer;
