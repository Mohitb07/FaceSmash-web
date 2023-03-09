import type { DocumentSnapshot } from 'firebase/firestore';
import InfiniteScroll from 'react-infinite-scroll-component';

import Footer from './Footer';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  renderItem: <T>(item: T) => JSX.Element;
  getMore: () => void;
  lastVisible: DocumentSnapshot | null;
};

const DataList = <D extends { key: string }>({
  data = [],
  getMore,
  renderItem,
  lastVisible,
  isLoading,
  ListEmptyComponent,
}: DataListProps<D>) => {
  if (data.length === 0 && !isLoading) {
    return <ListEmptyComponent />;
  }
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={getMore}
      scrollThreshold={0.9}
      hasMore={Boolean(lastVisible)}
      loader
    >
      <div className="space-y-8">
        {data.map((item) => (
          <div key={item.key}>{renderItem(item)}</div>
        ))}
        <Footer isLoading={isLoading} />
      </div>
    </InfiniteScroll>
  );
};

export default DataList;
