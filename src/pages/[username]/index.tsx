import {
  Avatar,
  Button,
  Skeleton,
  SlideFade,
  useDisclosure,
} from '@chakra-ui/react';
import { doc, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { lazy, Suspense, useMemo, useState } from 'react';
import { FiSettings } from 'react-icons/fi';

import Navigation from '@/common/Navigation';

import { db } from '../../../firebase';
import DataList from '../../components/DataList';
import EmptyData from '../../components/DataList/EmptyData';
import Footer from '../../components/DataList/Footer';
import Feed from '../../components/Feed';
import { USERS_COLLECTION } from '../../constant';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useConnection } from '../../hooks/useConnection';
import { useGetPosts } from '../../hooks/useGetPosts';
import { useGetUser } from '../../hooks/useGetUser';
import { useHandlePost } from '../../hooks/useHandlePost';
import type { Post } from '../../interface';
import { Meta } from '../../layouts/Meta';
import { withAuth } from '../../routes/WithProtected';
import { Main } from '../../templates/Main';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);
const ConnectionModal = lazy(() => import('../../components/ConnectionsModal'));

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
  const { postsLoading, userPosts, postsCount, getPosts, lastVisible } =
    useGetPosts(userId);

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
        <Navigation />
      </div>
      <div className="flex flex-col justify-start space-y-3 md:items-center md:justify-center md:space-y-10 md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 p-3 lg:gap-10 xl:gap-20">
          <div>
            <Skeleton borderRadius="full" isLoaded={!isUserDetailLoading}>
              <Avatar
                loading="lazy"
                size="2xl"
                ignoreFallback
                name={memoizedUserData.username}
                src={memoizedUserData.profilePic}
                showBorder
              />
            </Skeleton>
          </div>
          <Skeleton isLoaded={!isUserDetailLoading}>
            <div className="flex flex-col space-y-3 md:space-y-6">
              <div className="flex items-center gap-5">
                <p className="text-3xl font-light md:text-2xl lg:text-3xl xl:text-4xl">
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
              <div className="hidden items-center gap-5 text-lg md:flex">
                <p>
                  <span className="mr-2 font-semibold">{postsCount}</span> posts
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => handleModalOpen('Followers')}
                >
                  <span className="mr-2 font-semibold">
                    {connectionsCount.followers}
                  </span>{' '}
                  followers
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => handleModalOpen('Following')}
                >
                  <span className="mr-2 font-semibold">
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
        <div className="flex w-full flex-col px-5 text-left md:hidden">
          <span className="text-lg font-semibold">
            {memoizedUserData?.qusername}
          </span>
          <span className="text-base">{memoizedUserData?.bio}</span>
        </div>
        <div className="grid h-[5rem] w-full grid-cols-3 place-items-center border-y border-slate-700 p-1 md:hidden">
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
              ListFooterComponent={
                <Footer dataList={memoizedFeedList} loading={postsLoading} />
              }
              data={memoizedFeedList}
              isLoading={postsLoading}
              getMore={getPosts}
              lastVisible={lastVisible}
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
