import { lazy, Suspense, useState, useEffect } from 'react';

import { FiSettings } from 'react-icons/fi';
import {
  SkeletonCircle,
  useDisclosure,
  SkeletonText,
  Skeleton,
  Button,
} from '@chakra-ui/react';

// import Button from '../../components/Button';
import DataList from '../../components/DataList';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';
import Avatar from '../../components/Avatar';
import { useAuthUser } from '../../hooks/useAuthUser';
import Navigation from '../../common/Navigation';
import { Post } from '../../interface';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../../constant';
import { withAuth } from '../../routes/WithProtected';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);

// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authUser, loading } = useAuthUser();
  const [feedList, setfeedList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    const q = query(collection(db, POSTS_COLLECTION), where('user', '==', '6TvlX8oyiXQwNzxhm7Dj3vLuGsr1'),limit(FEED_LIMIT));
    getDocs(q).then((snap) => {
      const postList = snap.docs.map((d) => ({
        ...(d.data() as Post),
        key: d.id,
      }));
      setIsLoading(false);
      setfeedList(postList);
    });
  }, []);
  
  return (
    <Main
      meta={
        <Meta
          title="Mohit Bisht (@mohitbisht1903) - FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <Navigation />
      <div className="flex flex-col justify-start md:justify-center space-y-3 md:space-y-10 items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20 p-3">
          <div>
            {!!authUser ? (
              <Avatar height={200} width={200} url={authUser.profilePic} />
            ) : (
              <SkeletonCircle
                isLoaded={Boolean(authUser)}
                fadeDuration={1}
                height={200}
                width={200}
              />
            )}
          </div>
          <Skeleton isLoaded={!loading}>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-5">
                <p className="text-3xl md:text-xl lg:text-3xl xl:text-4xl font-light">
                  {authUser?.qusername}
                </p>
                <Button colorScheme="brand" color="white" onClick={onOpen}>
                  Edit profile
                </Button>
                <FiSettings className="text-xl xl:text-3xl" />
              </div>
              <div className="block md:hidden">
                <Button onClick={onOpen}>Edit profile</Button>
              </div>
              <div className="text-lg hidden items-center gap-5 md:flex">
                <p>
                  <span className="font-semibold mr-2">0</span> posts
                </p>
                <p>
                  <span className="font-semibold mr-2">0</span> followers
                </p>
                <p>
                  <span className="font-semibold mr-2">0</span> followings
                </p>
              </div>
              <div className="hidden md:flex">
                <span className="text-xl">{authUser?.bio}</span>
              </div>
            </div>
          </Skeleton>
        </div>
        <div className="flex flex-col md:hidden text-left w-full px-5">
          <span className="text-lg font-semibold">{authUser?.qusername}</span>
          <span className="text-base">{authUser?.bio}</span>
        </div>
        <div className="h-[5rem] grid grid-cols-3 border-y border-slate-700 place-items-center w-full p-1 md:hidden">
          <div className="text-center">
            <span className="font-semibold">1230</span>
            <p className="text-slate-400">posts</p>
          </div>
          <div className="text-center">
            <span className="font-semibold">120k</span>
            <p className="text-slate-400">followers</p>
          </div>
          <div className="text-center">
            <span className="font-semibold">100</span>
            <p className="text-slate-400">following</p>
          </div>
        </div>
        <div className="space-y-5 pb-16">
          <DataList list={feedList} isLoading={isLoading}/>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && <UpdateProfileModal onClose={onClose} isOpen={isOpen} />}
      </Suspense>
    </Main>
  );
};
export default withAuth(UserProfile);
