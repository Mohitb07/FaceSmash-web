import { useEffect, useState } from 'react';

import { BsSearch } from 'react-icons/bs';
import { SlideFade } from '@chakra-ui/react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import Brand from '../components/Brand';
import UserRecommendation from '../components/UserRecommendation';
import DataList from '../components/DataList';
import { Meta } from '../layouts/Meta';
import { withAuth } from '../routes/WithProtected';
import { Main } from '../templates/Main';
import Navigation from '../common/Navigation';
import { Post } from '../interface';
import EmptyData from '../components/DataList/EmptyData';
import Footer from '../components/DataList/Footer';
import Feed from '../components/Feed';
import { useAuthUser } from '../hooks/useAuthUser';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { db } from '../../firebase';
import { useHandlePost } from '../hooks/useHandlePost';

function Home() {
  const [feedList, setFeedList] = useState<Post[]>([]);
  const {userLikedPosts} = useHandlePost()
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthUser();

  useEffect(() => {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(FEED_LIMIT)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postList = querySnapshot.docs.map((d) => ({
        ...(d.data() as Post),
        key: d.id,
      }));
      setFeedList(postList);
      setIsLoading(false);
    });
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
        userId={feed.user}
        postTitle={feed.title}
        postId={feed.key}
        hasLiked={Boolean(userLikedPosts.find(post => post.postId === feed.key))}
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
          <header className="block md:hidden text-center">
            <Brand />
          </header>
          <div className="px-5">
            <div className="flex w-full md:hidden py-4 px-2 my-5 items-center bg-gray-800 rounded-md">
              <BsSearch className="text-xl text-slate-300 mx-3" />
              <input
                className="w-full bg-transparent outline-none border-none"
                type="text"
                placeholder="Search User..."
              />
            </div>
          </div>
          <div className="flex md:p-10 justify-center items-start gap-10">
            <main className="space-y-5 pb-16 md:ml-[20%] xl:ml-[10%]">
              <SlideFade in={isLoading || !isLoading} offsetY="20px">
                <DataList
                  ListEmptyComponent={EmptyData}
                  ListFooterComponent={Footer}
                  data={feedList}
                  isLoading={isLoading}
                  renderItem={(item: any) => renderItem(item)}
                />
              </SlideFade>
            </main>
            <aside className="hidden lg:flex flex-col">
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
