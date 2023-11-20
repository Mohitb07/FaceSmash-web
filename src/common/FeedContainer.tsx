import { SlideFade } from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import DataList from '@/components/DataList';
import EmptyData from '@/components/DataList/EmptyData';
import Feed from '@/components/Feed';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useGetPosts } from '@/hooks/useGetPosts';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { Post, User } from '@/interface';

type FeedContainerProps = {
  customQuery: Query<DocumentData>;
  userId?: string;
  isProfile?: boolean;
  isLoading?: boolean;
  user?: User;
};

const FeedContainer = ({
  customQuery,
  userId,
  isProfile = false,
  isLoading,
  user,
}: FeedContainerProps) => {
  const { authUser } = useAuthUser();
  const { userLikedPosts } = useHandlePost();
  const {
    getInitialPosts,
    getPosts,
    memoizedPosts,
    lastVisible,
    postsLoading,
    error,
  } = useGetPosts();
  useErrorHandler(error);

  useEffect(() => {
    const unsubscriber = getInitialPosts(customQuery);
    return () => unsubscriber();
  }, [userId]);

  function renderItem<T extends Post>(feed: T) {
    return (
      <Feed
        key={feed.key}
        authUserId={authUser?.uid || ''}
        username={feed.username}
        postImage={feed.image}
        userProfile={feed.userProfile}
        createdAt={feed.createdAt}
        description={feed.description}
        link={feed.link}
        imageRef={feed.imageRef}
        likes={feed.likes}
        userId={feed.uid}
        postTitle={feed.title}
        postId={feed.key}
        hasLiked={userLikedPosts.has(feed.key)}
      />
    );
  }

  const paginateMoreData = () => getPosts(customQuery);

  return (
    <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
      <DataList
        ListEmptyComponent={EmptyData}
        data={memoizedPosts}
        isLoading={postsLoading}
        renderItem={(item: any) => renderItem(item)}
        getMore={paginateMoreData}
        lastVisible={lastVisible}
        isProfile={isProfile}
        isUserLoading={isLoading}
        user={user}
        postQuery={customQuery}
        userId={userId}
      />
    </SlideFade>
  );
};
export default FeedContainer;
