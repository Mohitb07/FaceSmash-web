import { Skeleton, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';
import React from 'react';

type FooterProps = {
  dataList: any[];
  loading: boolean;
};

const Footer = ({ dataList = [], loading }: FooterProps) => {
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
  } else if (dataList.length > 0 && !loading) {
    content = (
      <Text textAlign="center" color="gray.500">
        No More post
      </Text>
    );
  } else {
    return null;
  }
  return <div>{content}</div>;
};
export default Footer;
