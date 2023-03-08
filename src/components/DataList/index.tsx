import type { DocumentSnapshot } from 'firebase/firestore';
import InfiniteScroll from 'react-infinite-scroll-component';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  ListFooterComponent: JSX.Element;
  renderItem: <T>(item: T) => JSX.Element;
  getMore: () => void;
  lastVisible: DocumentSnapshot | null;
};

const DataList = <D extends { key: string }>({
  data,
  getMore,
  renderItem,
  lastVisible,
  isLoading,
  ListFooterComponent,
  ListEmptyComponent,
}: DataListProps<D>) => {
  if (data.length < 0 && !isLoading) {
    return <ListEmptyComponent />;
  }
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={getMore}
      scrollThreshold={0.9}
      hasMore={Boolean(lastVisible)}
      loader={ListFooterComponent}
      endMessage={
        !isLoading &&
        !Boolean(lastVisible) &&
        data.length > 0 && (
          <p className="text-center text-slate-400">
            <b>Yay! You have seen it all</b>
          </p>
        )
      }
    >
      <div className="space-y-8">
        {data.map((item) => (
          <div key={item.key}>{renderItem(item)}</div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default DataList;
