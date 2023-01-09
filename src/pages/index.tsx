import { useEffect, useState } from 'react';

import { BsSearch } from 'react-icons/bs';
import { collection, query, getDocs, limit } from 'firebase/firestore';

import Brand from '../components/Brand';
import UserRecommendation from '../components/UserRecommendation';
import DataList from '../components/DataList';
import { Meta } from '../layouts/Meta';
import { withAuth } from '../routes/WithProtected';
import { Main } from '../templates/Main';
import Navigation from '../common/Navigation';
import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { Post } from '../interface';

function Home() {
  const [feedList, setfeedList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    const q = query(collection(db, POSTS_COLLECTION), limit(FEED_LIMIT));
    getDocs(q).then((snap) => {
      const postList = snap.docs.map((d) => ({
        ...(d.data() as Post),
        key: d.id,
      }));
      setIsLoading(false);
      setfeedList(postList);
    });
  }, []);

  console.log('posts list', feedList);

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
                <DataList list={feedList} isLoading={isLoading}/>
              </main>
              <aside className="hidden lg:flex flex-col">
                <UserRecommendation />
              </aside>
            </div>
          </div>
        </div>
    </Main>
  );
}

export default withAuth(Home);
