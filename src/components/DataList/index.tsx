import type { DocumentData, DocumentSnapshot, Query } from 'firebase/firestore';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CgFeed } from 'react-icons/cg';
import InfiniteScroll from 'react-infinite-scroll-component';

import type { User } from '@/interface';

import ErrorFallback from '../Error';
import ImagePreviewModal from '../ImagePreviewModal';
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
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt?: string;
    link?: string;
  } | null>(null);

  let endMessage = null;

  if (data.length > 0 && !isLoading && !isProfile) {
    endMessage = (
      <h4 className="py-12 text-center text-slate-500">
        Yay! You have seen it all
      </h4>
    );
  } else if (data.length === 0 && !isLoading && !isProfile) {
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
        className="absolute inset-0 overflow-y-auto scrollbar-hide lg:scrollbar-default"
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
          {isProfile ? (
            <div className="mx-auto min-h-screen w-full bg-[#0C1014] pb-20 shadow-2xl">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <UserDetail
                  isLoading={isUserLoading || false}
                  user={user!}
                  userId={userId!}
                  userQuery={postQuery!}
                />
              </ErrorBoundary>

              {/* Profile Posts List - Same Feed UI as Index Page */}
              <div className="mt-4 w-full space-y-3.5 px-2 pb-10 sm:space-y-6 sm:px-4">
                {data.map((item: any) => (
                  <div className="flex w-full justify-center" key={item.key}>
                    {renderItem(item)}
                  </div>
                ))}

                {/* Feed Skeleton Loader matching Index Page */}
                {isLoading && <Footer isLoading={isLoading} />}

                {/* Empty State */}
                {!isLoading && data.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                    <CgFeed className="mb-3 text-6xl text-zinc-600" />
                    <p className="text-base font-medium text-zinc-400">
                      No posts yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-20 md:pt-8">
              <div className="mx-auto w-full max-w-2xl space-y-3.5 px-2 pb-10 sm:space-y-6 sm:px-0">
                {data.map((item) => (
                  <div className="flex w-full justify-center" key={item.key}>
                    {renderItem(item)}
                  </div>
                ))}
                {isLoading && <Footer isLoading={isLoading} />}
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>

      <ImagePreviewModal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        imageSrc={previewImage?.src || ''}
        alt={previewImage?.alt}
        link={previewImage?.link}
      />
    </div>
  );
};

export default DataList;
