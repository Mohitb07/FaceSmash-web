import { lazy, Suspense, useState, useEffect } from 'react';

import { FiSettings } from 'react-icons/fi';
import {
  SkeletonCircle,
  useDisclosure,
  SkeletonText,
  Skeleton,
  Button,
  Avatar,
} from '@chakra-ui/react';

// import Button from '../../components/Button';
import DataList from '../../components/DataList';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';
// import Avatar from '../../components/Avatar';
import { useAuthUser } from '../../hooks/useAuthUser';
import Navigation from '../../common/Navigation';
import { IUserDetail, Post } from '../../interface';
import {
  collection,
  query,
  limit,
  getDocs,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION, USERS_COLLECTION } from '../../constant';
import { withAuth } from '../../routes/WithProtected';
import { useRouter } from 'next/router';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);

// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500

const DEFAULT_USER_DETAILS: IUserDetail = {
  bio: '',
  createdAt: '',
  email: '',
  lastSignIn: '',
  profilePic: '',
  qusername: '',
  uid: '',
  username: '',
};

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authUser, loading } = useAuthUser();
  const [feedList, setfeedList] = useState<Post[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);
  const [userData, setUserData] = useState<IUserDetail>(DEFAULT_USER_DETAILS);

  const router = useRouter();
  const userId = router.query.user_id;

  useEffect(() => {
    setIsPostLoading(true);
    async function getUserPosts() {
      if (userId) {
        const q = query(
          collection(db, POSTS_COLLECTION),
          where('user', '==', userId),
          limit(FEED_LIMIT)
        );
        const snap = await getDocs(q);
        const postList = snap.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setfeedList(postList);
      }
      setIsPostLoading(false);
    }
    getUserPosts();
  }, [userId]);

  useEffect(() => {
    setIsUserDataLoading(true);
    async function fetchUserData() {
      if (userId && userId !== authUser?.uid) {
        const userDocRef = doc(db, USERS_COLLECTION, userId as string);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          console.log('docuemnt data', docSnap.data());
          setUserData((prev) => ({
            ...prev,
            ...docSnap.data(),
            key: docSnap.id,
          }));
        } else {
          console.log('404');
        }
      } else {
        console.log('from context');
        if (userId === authUser?.uid) {
          setUserData((prev) => ({
            ...prev,
            ...authUser,
          }));
        }
      }
      setIsUserDataLoading(false);
    }
    fetchUserData();
  }, [userId, authUser?.uid]);

  return (
    <Main
      meta={
        <Meta
          title={`${userData?.username} (${userData?.email}) - FaceSmash`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <Navigation />
      <div className="flex flex-col justify-start md:justify-center space-y-3 md:space-y-10 md:items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20 p-3">
          <div>
            {isUserDataLoading ? (
              <SkeletonCircle
                isLoaded={Boolean(userData)}
                fadeDuration={1}
                height={200}
                width={200}
              />
            ) : (
              // <Avatar height={200} width={200} url={userData.profilePic} />
              <Avatar
                loading='eager'
                size="2xl"
                name="Dan Abrahmov"
                src="https://bit.ly/dan-abramov"
                showBorder
              />
            )}
          </div>
          <Skeleton isLoaded={!isUserDataLoading}>
            <div className="flex flex-col space-y-3 md:space-y-6">
              <div className="flex items-center gap-5">
                <p className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl font-light">
                  {userData?.qusername}
                </p>
                <div className="hidden md:block">
                  <Button colorScheme="brand" color="white" onClick={onOpen}>
                    Edit profile
                  </Button>
                </div>
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
                <span className="text-xl">{userData?.bio}</span>
              </div>
            </div>
          </Skeleton>
        </div>
        <div className="flex flex-col md:hidden text-left w-full px-5">
          <span className="text-lg font-semibold">{userData?.qusername}</span>
          <span className="text-base">{userData?.bio}</span>
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
          <DataList list={feedList} isLoading={isPostLoading} />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && <UpdateProfileModal onClose={onClose} isOpen={isOpen} />}
      </Suspense>
    </Main>
  );
};
export default withAuth(UserProfile);
