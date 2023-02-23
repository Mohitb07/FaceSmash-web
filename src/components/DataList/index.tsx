import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import React, { useEffect, useRef } from 'react';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  ListFooterComponent: JSX.Element;
  renderItem: <T>(item: T) => JSX.Element;
  getMore: () => Unsubscribe;
  lastVisible?: DocumentSnapshot;
};

const DataList = <D extends { key: string }>({
  data,
  isLoading,
  ListEmptyComponent,
  ListFooterComponent,
  renderItem,
  getMore,
  lastVisible,
}: DataListProps<D>) => {
  const lastPostId = data[data.length - 1]?.key;
  const isMounted = useRef(false);
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (isMounted.current) {
          if (entry.isIntersecting && lastVisible) {
            console.log('calling getMore');
            unsubscribe = getMore();
          }
        } else {
          isMounted.current = true;
        }
      });
    });

    const lastPostElement = document.getElementById(lastPostId);
    if (lastPostElement) {
      observer.observe(lastPostElement);
    }

    return () => {
      observer.disconnect();
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [lastVisible, getMore]);

  if (data.length === 0 && !isLoading) {
    return <ListEmptyComponent />;
  }
  return (
    <>
      <div className="space-y-8">
        {data.map((item) => (
          <div key={item.key} id={item.key}>
            {renderItem(item)}
          </div>
        ))}
        {ListFooterComponent}
      </div>
    </>
  );
};
export default DataList;
