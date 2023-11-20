import type { DocumentData, DocumentSnapshot, Query } from 'firebase/firestore';
import { ErrorBoundary } from 'react-error-boundary';
import InfiniteScroll from 'react-infinite-scroll-component';

import type { User } from '@/interface';

import ErrorFallback from '../Error';
import UserDetail from '../Profile/UserDetails';
import Footer from './Footer';

type DataListProps<D> = {
  data: D[];
  isLoading: boolean;
  ListEmptyComponent: React.ComponentType;
  renderItem: <T>(item: T) => JSX.Element;
  getMore: () => void;
  lastVisible: DocumentSnapshot | null;
  isProfile?: boolean;
  userId?: string;
  isUserLoading?: boolean;
  user?: User;
  postQuery?: Query<DocumentData>;
};

const DataList = <D extends { key: string }>({
  data = [],
  getMore,
  renderItem,
  lastVisible,
  isLoading,
  ListEmptyComponent,
  isProfile = false,
  isUserLoading,
  user,
  postQuery,
  userId,
}: DataListProps<D>) => {
  let endMessage = null;
  if (data.length > 0 && !isLoading) {
    endMessage = (
      <h4 className="my-2 text-center text-slate-500">
        Yay! You have seen it all
      </h4>
    );
  } else if (data.length === 0 && !isLoading) {
    endMessage = (
      <h4 className="my-2 text-center text-slate-500">
        <ListEmptyComponent />
      </h4>
    );
  }

  return (
    <div
      className={`relative h-[calc(100vh-3.5rem)] ${
        isProfile ? 'md:h-[calc(100vh)]' : 'md:h-screen'
      }`}
    >
      <div
        id="scrollableDiv"
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={getMore}
          hasMore={Boolean(lastVisible)}
          loader
          endMessage={endMessage}
          scrollThreshold={0.9}
          scrollableTarget="scrollableDiv"
        >
          {isProfile && (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <UserDetail
                isLoading={isUserLoading || false}
                user={user!}
                userId={userId!}
                userQuery={postQuery!}
              />
            </ErrorBoundary>
          )}
          <div
            className={`flex h-full w-full flex-col  space-y-10 ${
              isProfile ? 'pt-2' : 'pt-16'
            } md:pt-[1rem]`}
          >
            <div className="mx-auto w-full max-w-2xl space-y-5 p-2 px-4">
              {data.map((item) => (
                <div className="place-items-center" key={item.key}>
                  {renderItem(item)}
                </div>
              ))}
            </div>
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
