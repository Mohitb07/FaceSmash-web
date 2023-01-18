import { lazy, Suspense, useState, useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';
import { FiSettings } from 'react-icons/fi';
import {
  SkeletonCircle,
  useDisclosure,
  Skeleton,
  Button,
  Avatar,
  SlideFade,
} from '@chakra-ui/react';

import DataList from '../../components/DataList';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';
import { useAuthUser } from '../../hooks/useAuthUser';
import { User, Post } from '../../interface';
import { withAuth } from '../../routes/WithProtected';
import Sidebar from '../../components/SideNavigation';
import BottomNavigation from '../../components/BottomNavigation';
import { useGetUser } from '../../hooks/useGetUser';
import Feed from '../../components/Feed';
import EmptyData from '../../components/DataList/EmptyData';
import Footer from '../../components/DataList/Footer';
import { useHandlePost } from '../../hooks/useHandlePost';
import {
  collection,
  query,
  Unsubscribe,
  where,
  limit,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { FEED_LIMIT, POSTS_COLLECTION } from '../../constant';
import { db } from '../../../firebase';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);
// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500
const DEFAULT_USER_DETAILS: User = {
  bio: '',
  createdAt: '',
  email: '',
  lastSignIn: '',
  profilePic: '',
  qusername: '',
  uid: '',
  username: '',
};

type UserData = {
  userDetails: User;
  feedList: Post[];
};

const UserProfile = () => {
  const router = useRouter();
  const userId = router.query.user_id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authUser } = useAuthUser();
  const { getUserDetail } = useGetUser();
  const { userLikedPosts } = useHandlePost();
  const [userData, setUserData] = useState<User>(DEFAULT_USER_DETAILS);
  const [feedList, setFeedList] = useState<Post[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isUserDetailLoading, setIsUserDetailLoading] = useState(true);

  useEffect(() => {
    console.log('profile');
    const getProfileData = async () => {
      try {
        if (userId !== authUser?.uid) {
          const [userDetailResult] = await Promise.all([
            getUserDetail(userId as string),
          ]);
          if (!userDetailResult.exists()) return;
          const user_data = {
            ...(userDetailResult.data() as User),
            key: userDetailResult.id,
          };
          setUserData(user_data)
        } else {
          if (authUser) {
            const user = {
              ...authUser,
              key: authUser?.uid,
            };
            setUserData(user)
          }
        }
      } catch (error) {
        throw new Error(`Error ${error}`);
      } finally {
        setIsUserDetailLoading(false);
      }
    };
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, getUserDetail]);

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    try {
      const userPostsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('user', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(FEED_LIMIT)
      );
      unsubscriber = onSnapshot(userPostsQuery, (querySnapshot) => {
        const postList = querySnapshot.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setFeedList(postList)
        setIsFeedLoading(false);
      });
    } catch (error) {
      console.log('useGetPosts error', error);
      setIsFeedLoading(false);
    }
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
        userId={feed.user}
        postTitle={feed.title}
        postId={feed.key}
        hasLiked={Boolean(
          userLikedPosts.find((post) => post.postId === feed.key)
        )}
      />
    );
  }

  const memoizedFeedList: Post[] = useMemo(() => feedList, [feedList]);
  const memoizedUserData = useMemo(() => userData, [userData]);

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
        <div>
          <Sidebar />
        </div>
        <div className="bg-slate-900 fixed z-50 bottom-0 w-full">
          <BottomNavigation />
        </div>
      </div>
      <div className="flex flex-col justify-start md:justify-center space-y-3 md:space-y-10 md:items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20 p-3">
          <div>
            {isUserDetailLoading ? (
              <SkeletonCircle height={200} width={200} />
            ) : (
              // <Avatar height={200} width={200} url={userData.profilePic} />
              <Avatar
                loading="eager"
                size="2xl"
                name={memoizedUserData.username}
                src={memoizedUserData.profilePic}
                showBorder
              />
            )}
          </div>
          <Skeleton isLoaded={!isUserDetailLoading}>
            <div className="flex flex-col space-y-3 md:space-y-6">
              <div className="flex items-center gap-5">
                <p className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl font-light">
                  {memoizedUserData.qusername}
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
                <span className="text-xl">{memoizedUserData?.bio}</span>
              </div>
            </div>
          </Skeleton>
        </div>
        <div className="flex flex-col md:hidden text-left w-full px-5">
          <span className="text-lg font-semibold">
            {memoizedUserData?.qusername}
          </span>
          <span className="text-base">{memoizedUserData?.bio}</span>
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
          <SlideFade in={isFeedLoading || !isFeedLoading} offsetY="20px">
            <DataList
              renderItem={(item: any) => renderItem(item)}
              ListEmptyComponent={EmptyData}
              ListFooterComponent={Footer}
              data={memoizedFeedList}
              isLoading={isFeedLoading}
            />
          </SlideFade>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && <UpdateProfileModal onClose={onClose} isOpen={isOpen} />}
      </Suspense>
    </Main>
  );
};
export default withAuth(UserProfile);
