import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import React from 'react';

type FooterProps = {
  dataList: any[];
  loading: boolean;
  hasNext: boolean;
};

const Footer = ({ loading }: FooterProps) => {
  let content;
  if (loading) {
    content = (
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
  return <div>{content}</div>;
};
export default Footer;
