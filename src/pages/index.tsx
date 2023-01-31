import { SlideFade } from '@chakra-ui/react';
import type { DocumentSnapshot } from 'firebase/firestore';
import {
  collection,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import { db } from '../../firebase';
import Navigation from '../common/Navigation';
import Brand from '../components/Brand';
import DataList from '../components/DataList';
import EmptyData from '../components/DataList/EmptyData';
import Footer from '../components/DataList/Footer';
import Feed from '../components/Feed';
import UserRecommendation from '../components/UserRecommendation';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { useAuthUser } from '../hooks/useAuthUser';
import { useHandlePost } from '../hooks/useHandlePost';
import type { Post, User } from '../interface';
import { Meta } from '../layouts/Meta';
import { withAuth } from '../routes/WithProtected';
import { Main } from '../templates/Main';

function Home() {
  const [feedList, setFeedList] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot>();
  const { userLikedPosts } = useHandlePost();
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthUser();

  const getPosts = useCallback(() => {
    setIsLoading(true);
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(FEED_LIMIT)
    );
    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const postUserPromises = querySnapshot.docs.map((d) =>
            getDoc(d.data().user)
          );
          const rawResult = await Promise.all(postUserPromises);
          const result: User[] = rawResult.map((d) => d.data() as User);
          const postList = querySnapshot.docs.map((d, index) => {
            return {
              ...(d.data() as Post),
              username: result[index].username,
              userProfile: result[index].profilePic,
              key: d.id,
            };
          });
          setFeedList((prev) => [...prev, ...postList]);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
        setIsLoading(false);
      },
      (err) => {
        console.log('error while fetching posts', err);
      }
    );
    return unsubscribe;
  }, [lastVisible]);

  useEffect(() => {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(FEED_LIMIT)
    );
    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const postUserPromises = querySnapshot.docs.map((d) =>
            getDoc(d.data().user)
          );
          const rawResult = await Promise.all(postUserPromises);
          const result: User[] = rawResult.map((d) => d.data() as User);
          const postList = querySnapshot.docs.map((d, index) => {
            return {
              ...(d.data() as Post),
              username: result[index].username,
              userProfile: result[index].profilePic,
              key: d.id,
            };
          });
          setFeedList(postList);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
        setIsLoading(false);
      },
      (err) => {
        console.log('error while fetching posts', err);
      }
    );
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
              <SlideFade in={isLoading || !isLoading} offsetY="20px">
                <DataList
                  ListEmptyComponent={EmptyData}
                  ListFooterComponent={
                    <Footer dataList={feedList} loading={isLoading} />
                  }
                  data={feedList}
                  isLoading={isLoading}
                  renderItem={(item: any) => renderItem(item)}
                  getMore={getPosts}
                  lastVisible={lastVisible}
                />
              </SlideFade>
            </main>
            <aside className="hidden flex-col lg:flex">
              <SlideFade in={isLoading || !isLoading} offsetY="20px">
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
