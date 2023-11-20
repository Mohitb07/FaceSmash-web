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
    <div className="relative h-[calc(100vh+4rem)] w-full overflow-hidden pb-10 md:h-screen md:pb-0">
      <div
        id="scrollableDiv"
        // className="absolute inset-0 mx-auto w-full overflow-y-auto bg-red-500 pt-5 pb-10 md:w-1/2 md:pb-0"
        className="absolute inset-0 mx-auto w-full overflow-y-auto pt-5 pb-20 md:w-full md:pb-0"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={getMore}
          hasMore={Boolean(lastVisible)}
          loader
          endMessage={
            <h4 className="mt-2 text-center text-slate-500">
              Yay! You have seen it all
            </h4>
          }
          scrollThreshold={0.9}
          scrollableTarget="scrollableDiv"
        >
          <div className="mx-auto flex w-full flex-col space-y-10 overflow-y-auto md:w-1/2">
            {data.map((item) => (
              <div className="place-items-center" key={item.key}>
                {renderItem(item)}
              </div>
            ))}
          </div>
          <div className="flex w-full justify-center">
            <Footer isLoading={isLoading} />
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default DataList;
