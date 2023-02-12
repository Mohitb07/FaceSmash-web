import { SlideFade } from '@chakra-ui/react';
import type { DocumentData, Query, Unsubscribe } from 'firebase/firestore';
import React, { useCallback, useEffect } from 'react';

import DataList from '@/components/DataList';
import EmptyData from '@/components/DataList/EmptyData';
import Footer from '@/components/DataList/Footer';
import Feed from '@/components/Feed';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useGetPosts } from '@/hooks/useGetPosts';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { Post } from '@/interface';

type FeedContainerProps = {
  userQuery: Query<DocumentData>;
};

const FeedContainer = ({ userQuery }: FeedContainerProps) => {
  const { authUser } = useAuthUser();
  const { userLikedPosts } = useHandlePost();
  const {
    getInitialPosts,
    getPosts,
    memoizedPosts,
    lastVisible,
    postsLoading,
  } = useGetPosts();

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    unsubscriber = getInitialPosts(userQuery);
    return () => {
      unsubscriber();
    };
  }, [userQuery]);

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

  const paginateMoreData = useCallback(() => getPosts(userQuery), [getPosts]);

  return (
    <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
      <DataList
        ListEmptyComponent={EmptyData}
        ListFooterComponent={
          <Footer dataList={memoizedPosts} loading={postsLoading} />
        }
        data={memoizedPosts}
        isLoading={postsLoading}
        renderItem={(item: any) => renderItem(item)}
        getMore={paginateMoreData}
        lastVisible={lastVisible}
      />
    </SlideFade>
  );
};
export default FeedContainer;