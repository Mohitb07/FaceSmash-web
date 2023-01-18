import React from 'react';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  ListFooterComponent: React.ComponentType;
  renderItem: <T>(item: T) => JSX.Element;
};

const DataList = <D extends any>({
  data,
  isLoading,
  ListEmptyComponent,
  ListFooterComponent,
  renderItem,
}: DataListProps<D>) => {
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
  if (data.length === 0 && !isLoading) {
    return <ListEmptyComponent />;
  }
  return (
    <>
      <div className="space-y-8">
        {data.map((item) => renderItem(item))}
        {!isLoading && <ListFooterComponent />}
      </div>
    </>
  );
};
export default DataList;
