import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

import { Post } from '../../interface';

type DataListProps = {
  data: Post[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  ListFooterComponent: React.ComponentType;
  renderItem: <T>(item: T) => JSX.Element
};

const DataList = ({
  data,
  isLoading,
  ListEmptyComponent,
  ListFooterComponent,
  renderItem,
}: DataListProps) => {
  if (isLoading) {
    return (
      <div className="md:w-[500px] space-y-5 lg:w-[450px] xl:w-[600px] rounded-md">
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
  if (data.length === 0) {
    return <ListEmptyComponent />;
  }
  return (
    <>
      {data.map((item) => renderItem(item))}
      {!isLoading && <ListFooterComponent />}
    </>
  );
};
export default DataList;
