import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import React from 'react';

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-5 rounded-md md:w-[480px]">
        <div className="space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
        <div className="space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
        <div className="space-y-2">
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
