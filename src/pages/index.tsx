import { SlideFade } from '@chakra-ui/react';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';

import Navigation from '@/common/Navigation';
import { useGetPosts } from '@/hooks/useGetPosts';

import { db } from '../../firebase';
import Brand from '../components/Brand';
import DataList from '../components/DataList';
import EmptyData from '../components/DataList/EmptyData';
import Footer from '../components/DataList/Footer';
import Feed from '../components/Feed';
import UserRecommendation from '../components/UserRecommendation';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { useAuthUser } from '../hooks/useAuthUser';
import { useHandlePost } from '../hooks/useHandlePost';
import type { Post } from '../interface';
import { Meta } from '../layouts/Meta';
import { withAuth } from '../routes/WithProtected';
import { Main } from '../templates/Main';

function Home() {
  const { userLikedPosts } = useHandlePost();
  const { authUser } = useAuthUser();
  const {
    getInitialPosts,
    getPosts,
    memoizedPosts,
    lastVisible,
    postsLoading,
  } = useGetPosts();

  const userQuery = useMemo(
    () => query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc')),
    []
  );

  useEffect(() => {
    const q = query(userQuery, limit(FEED_LIMIT));
    const unsubscribe = getInitialPosts(q);
    return () => unsubscribe();
  }, []);

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
        hasLiked={Boolean(
          userLikedPosts.find((post) => post.postId === feed.key)
        )}
      />
    );
  }

  const paginateMoreData = useCallback(() => getPosts(userQuery), [getPosts]);

  return (
    <Main
      meta={
        <Meta
          title="FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <Navigation />
      <div className="h-screen">
        <div>
          <header className="block text-center md:hidden">
            <Brand />
          </header>
          <div className="px-5">
            <div className="my-5 flex w-full items-center rounded-md bg-gray-800 py-4 px-2 md:hidden">
              <BsSearch className="mx-3 text-xl text-slate-300" />
              <input
                className="w-full border-none bg-transparent outline-none"
                type="text"
                placeholder="Search User..."
              />
            </div>
          </div>
          <div className="flex items-start justify-center gap-10 md:p-10">
            <main className="w-full space-y-5 pb-16 md:ml-[20%] md:w-auto xl:ml-[10%]">
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
            </main>
            <aside className="hidden flex-col lg:flex">
              <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
                <UserRecommendation />
              </SlideFade>
            </aside>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default withAuth(Home);
