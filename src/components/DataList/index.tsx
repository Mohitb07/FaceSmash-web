import React, { useEffect } from 'react';
import { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';

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

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (lastVisible) {
            unsubscribe = getMore();
          }
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
  }, [lastPostId, getMore, lastVisible]);

  if (data.length === 0 && !isLoading) {
    return <ListEmptyComponent />;
  }
  return (
    <>
      <div className="space-y-8">
        {data.map((item) => {
          return (
            <div key={item.key} id={item.key}>
              {renderItem(item)}
            </div>
          );
        })}
        {ListFooterComponent}
      </div>
    </>
  );
};
export default DataList;
