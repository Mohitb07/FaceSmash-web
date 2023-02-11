import { SlideFade } from '@chakra-ui/react';
import type { Unsubscribe } from 'firebase/firestore';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';

import Navigation from '@/common/Navigation';
import DataList from '@/components/DataList';
import EmptyData from '@/components/DataList/EmptyData';
import Footer from '@/components/DataList/Footer';
import Feed from '@/components/Feed';
import UserDetail from '@/components/Profile/UserDetails';
import { POSTS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useGetPosts } from '@/hooks/useGetPosts';
import { useGetUser } from '@/hooks/useGetUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { Post } from '@/interface';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';

import { db } from '../../../firebase';

const UserProfile = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { authUser } = useAuthUser();
  const { userDetail, isUserDetailLoading } = useGetUser(userId);
  const { userLikedPosts } = useHandlePost();
  const {
    postsLoading,
    memoizedPosts,
    getPosts,
    lastVisible,
    getInitialPosts,
  } = useGetPosts();

  const userQuery = useMemo(
    () =>
      query(
        collection(db, POSTS_COLLECTION),
        where('uid', '==', userId),
        orderBy('createdAt', 'desc')
      ),
    [userId]
  );

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    unsubscriber = getInitialPosts(userQuery);
    return () => {
      unsubscriber();
    };
  }, [userId, userQuery]);

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

  const memoizedUserData = useMemo(() => userDetail, [userDetail]);
  const paginateMoreData = useCallback(() => getPosts(userQuery), [getPosts]);

  return (
    <Main
      meta={
        <Meta
          title={`${memoizedUserData?.username} (${memoizedUserData?.email}) - FaceSmash`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div>
        <Navigation />
      </div>
      <div className="flex flex-col justify-start space-y-3 md:items-center md:justify-center md:space-y-10 md:p-10 lg:ml-[10%] xl:ml-0">
        <UserDetail
          isLoading={isUserDetailLoading}
          user={userDetail}
          userId={userId}
          userQuery={userQuery}
        />

        <div className="space-y-5 pb-16">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <DataList
              renderItem={(item: any) => renderItem(item)}
              ListEmptyComponent={EmptyData}
              ListFooterComponent={
                <Footer dataList={memoizedPosts} loading={postsLoading} />
              }
              data={memoizedPosts}
              isLoading={postsLoading}
              getMore={paginateMoreData}
              lastVisible={lastVisible}
            />
          </SlideFade>
        </div>
      </div>
    </Main>
  );
};
export default withAuth(UserProfile);
