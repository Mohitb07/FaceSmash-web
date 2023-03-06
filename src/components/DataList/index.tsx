// import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';
// import React, { useEffect, useRef } from 'react';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  ListFooterComponent: JSX.Element;
  renderItem: <T>(item: T) => JSX.Element;
  getMore: () => void;
  lastVisible: DocumentSnapshot | null;
};

import type { DocumentSnapshot } from 'firebase/firestore';
// const DataList = <D extends { key: string }>({
//   data,
//   isLoading,
//   ListEmptyComponent,
//   ListFooterComponent,
//   renderItem,
//   getMore,
//   lastVisible,
// }: DataListProps<D>) => {
//   const lastPostId = data[data.length - 1]?.key;
//   const isMounted = useRef(false);
//   useEffect(() => {
//     let unsubscribe: Unsubscribe;
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (isMounted.current) {
//           if (entry.isIntersecting && lastVisible) {
//             console.log('calling getMore');
//             unsubscribe = getMore();
//           }
//         } else {
//           isMounted.current = true;
//         }
//       });
//     });
//     const lastPostElement = document.getElementById(lastPostId);
//     if (lastPostElement) {
//       observer.observe(lastPostElement);
//     }
//     return () => {
//       observer.disconnect();
//       if (typeof unsubscribe === 'function') unsubscribe();
//     };
//   }, [lastVisible, getMore]);
//   if (data.length === 0 && !isLoading) {
//     return <ListEmptyComponent />;
//   }
//   return (
//     <>
//       <div className="space-y-8">
//         {data.map((item) => (
//           <div key={item.key} id={item.key}>
//             {renderItem(item)}
//           </div>
//         ))}
//         {ListFooterComponent}
//       </div>
//     </>
//   );
// };
// export default DataList;
import InfiniteScroll from 'react-infinite-scroll-component';

const DataList = <D extends { key: string }>({
  data,
  getMore,
  renderItem,
  lastVisible,
  ListFooterComponent,
}: DataListProps<D>) => {
  return (
    <InfiniteScroll
      dataLength={data.length} //This is important field to render the next data
      next={getMore}
      scrollThreshold={0.9}
      hasMore={Boolean(lastVisible)}
      loader={ListFooterComponent}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
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
