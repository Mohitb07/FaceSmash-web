import { lazy, Suspense, useMemo, useState } from 'react';

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
import Sidebar from '../../components/SideNavigation';
import BottomNavigation from '../../components/BottomNavigation';
import EmptyData from '../../components/DataList/EmptyData';
import Footer from '../../components/DataList/Footer';
import Feed from '../../components/Feed';
import ConnectionModal from '../../components/ConnectionsModal';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';
import { Post } from '../../interface';
import { withAuth } from '../../routes/WithProtected';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useGetUser } from '../../hooks/useGetUser';
import { useHandlePost } from '../../hooks/useHandlePost';
import { useGetPosts } from '../../hooks/useGetPosts';
import { useConnection } from '../../hooks/useConnection';
import { db } from '../../../firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { USERS_COLLECTION } from '../../constant';
import { ref } from 'firebase/storage';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);
// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500

type ModalType = 'Edit profile' | 'Followers' | 'Following' | null;

const UserProfile = () => {
  const router = useRouter();
  const userId = router.query.user_id as string;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<ModalType>(null);
  const { authUser } = useAuthUser();
  const { userDetail, isUserDetailLoading } = useGetUser(userId);
  const { connectionsCount, followersList, followingList } =
    useConnection(userId);
  const { userLikedPosts } = useHandlePost();
  const { postsLoading, userPosts, postsCount } = useGetPosts(userId);

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

  const memoizedFeedList: Post[] = useMemo(() => userPosts, [userPosts]);
  const memoizedUserData = useMemo(() => userDetail, [userDetail]);
  const hasFollowedThisUser = useMemo(
    () => !!followersList.find((user) => user.uid === authUser?.uid),
    [authUser?.uid, followersList]
  );

  const handleModalOpen = (type: ModalType) => {
    setModalType(type);
    onOpen();
  };

  const handleConnections = () => {
    const batch = writeBatch(db);
    if (authUser) {
      const authUserFollowingDocRef = doc(
        db,
        `${USERS_COLLECTION}/${authUser.uid}/followings/${userId}`
      );
      const profileUserFollowerDocRef = doc(
        db,
        `${USERS_COLLECTION}/${userId}/followers/${authUser.uid}`
      );
      if (hasFollowedThisUser) {
        // unfollow
        batch.delete(authUserFollowingDocRef);
        batch.delete(profileUserFollowerDocRef);
      } else {
        // follow user
        batch.set(authUserFollowingDocRef, {
          user: doc(db, `/${USERS_COLLECTION}/${userId}`),
        });
        batch.set(profileUserFollowerDocRef, {
          user: doc(db, `/${USERS_COLLECTION}/${authUser.uid}`),
        });
      }
    }
    batch
      .commit()
      .catch((err) =>
        console.log('error while following/unfollowing user', err)
      );
  };

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
              <Avatar
                loading="lazy"
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
                  {authUser?.uid === userId ? (
                    <Button
                      colorScheme="brand"
                      color="white"
                      onClick={() => handleModalOpen('Edit profile')}
                    >
                      Edit profile
                    </Button>
                  ) : (
                    <Button
                      colorScheme="brand"
                      color="white"
                      onClick={handleConnections}
                    >
                      {hasFollowedThisUser ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
                <FiSettings className="text-xl xl:text-3xl" />
              </div>
              <div className="block md:hidden">
                <Button onClick={() => handleModalOpen('Edit profile')}>
                  Edit profile
                </Button>
              </div>
              <div className="text-lg hidden items-center gap-5 md:flex">
                <p>
                  <span className="font-semibold mr-2">{postsCount}</span> posts
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => handleModalOpen('Followers')}
                >
                  <span className="font-semibold mr-2">
                    {connectionsCount.followers}
                  </span>{' '}
                  followers
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => handleModalOpen('Following')}
                >
                  <span className="font-semibold mr-2">
                    {connectionsCount.following}
                  </span>{' '}
                  followings
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
            <span className="font-semibold">{postsCount}</span>
            <p className="text-slate-400">posts</p>
          </div>
          <div
            className="text-center"
            onClick={() => handleModalOpen('Followers')}
          >
            <span className="font-semibold">{connectionsCount.followers}</span>
            <p className="text-slate-400">followers</p>
          </div>
          <div
            className="text-center"
            onClick={() => handleModalOpen('Following')}
          >
            <span className="font-semibold">{connectionsCount.following}</span>
            <p className="text-slate-400">following</p>
          </div>
        </div>
        <div className="space-y-5 pb-16">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <DataList
              renderItem={(item: any) => renderItem(item)}
              ListEmptyComponent={EmptyData}
              ListFooterComponent={Footer}
              data={memoizedFeedList}
              isLoading={postsLoading}
            />
          </SlideFade>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && modalType === 'Edit profile' && (
          <UpdateProfileModal onClose={onClose} isOpen={isOpen} />
        )}
        {isOpen && modalType !== 'Edit profile' && (
          <ConnectionModal
            data={modalType === 'Followers' ? followersList : followingList}
            title={modalType!}
            onClose={onClose}
            isOpen={isOpen}
          />
        )}
      </Suspense>
    </Main>
  );
};
export default withAuth(UserProfile);
