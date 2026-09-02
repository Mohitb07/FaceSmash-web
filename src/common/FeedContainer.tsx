import {
  Flex,
  Modal,
  ModalBody,
  ModalOverlay,
  SlideFade,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import { doc, increment, writeBatch } from 'firebase/firestore';
import { Suspense, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import DataList from '@/components/DataList';
import EmptyData from '@/components/DataList/EmptyData';
import Feed from '@/components/Feed';
import PostModal from '@/components/SideNavigation/PostModal';
import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useGetPosts } from '@/hooks/useGetPosts';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { Post, PostFormData, User } from '@/interface';

import { db } from '../../firebase';

type FeedContainerProps = {
  customQuery: Query<DocumentData>;
  userId?: string;
  isProfile?: boolean;
  isLoading?: boolean;
  user?: User;
};

const FeedContainer = ({
  customQuery,
  userId,
  isProfile = false,
  isLoading,
  user,
}: FeedContainerProps) => {
  const { authUser } = useAuthUser();
  const { userLikedPosts } = useHandlePost();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialPostValues, setInitialPostValues] = useState<PostFormData>({
    title: '',
    description: '',
    link: '',
    image: '',
  });
  const [postId, setPostId] = useState('');
  const [imageRef, setImageRef] = useState('');

  const {
    getInitialPosts,
    getPosts,
    memoizedPosts,
    lastVisible,
    postsLoading,
    updatePostLikes,
    error,
  } = useGetPosts();
  useErrorHandler(error);

  useEffect(() => {
    const unsubscriber = getInitialPosts(customQuery);
    return () => unsubscriber();
  }, [userId]);

  const modalClose = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleLikes = async (pid: string) => {
    if (!authUser?.uid) return;

    const currentlyLiked = userLikedPosts.has(pid);
    const delta = currentlyLiked ? -1 : 1;

    // 1. Optimistic UI update: instantly increment / decrement like count
    updatePostLikes(pid, delta);

    const batch = writeBatch(db);
    const postLikesSubColRef = doc(
      db,
      `${USERS_COLLECTION}/${authUser.uid}/postlikes/${pid}`
    );
    const postRef = doc(db, POSTS_COLLECTION, pid);

    if (currentlyLiked) {
      batch.delete(postLikesSubColRef);
      batch.update(postRef, {
        likes: increment(-1),
      });
    } else {
      batch.set(postLikesSubColRef, {
        likes: true,
        postId: pid,
      });
      batch.update(postRef, {
        likes: increment(1),
      });
    }

    try {
      await batch.commit();
    } catch (err) {
      console.error('Error while updating post like in Firestore', err);
      // 2. Rollback optimistic update if Firestore write fails
      updatePostLikes(pid, -delta);
      toast({
        title: 'Failed to update like. Rolled back.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

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
        setPostEditModal={setIsModalOpen}
        handleLikes={handleLikes}
        setInitialPostValues={setInitialPostValues}
        setPostId={setPostId}
        setImageRef={setImageRef}
      />
    );
  }

  const paginateMoreData = () => getPosts(customQuery);

  return (
    <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
      <DataList
        ListEmptyComponent={EmptyData}
        data={memoizedPosts}
        isLoading={postsLoading}
        renderItem={(item: any) => renderItem(item)}
        getMore={paginateMoreData}
        lastVisible={lastVisible}
        isProfile={isProfile}
        isUserLoading={isLoading}
        user={user}
        postQuery={customQuery}
        userId={userId}
      />
      <Suspense
        fallback={
          <Modal isCentered size="full" isOpen={true} onClose={() => {}}>
            <ModalOverlay />
            <ModalBody>
              <Flex justifyContent="center" alignItems="center">
                <Spinner />
              </Flex>
            </ModalBody>
          </Modal>
        }
      >
        {isModalOpen && (
          <PostModal
            initialFormData={initialPostValues}
            mode="edit"
            isModalOpen={isModalOpen}
            modalClose={modalClose}
            postId={postId}
            imageRef={imageRef}
          />
        )}
      </Suspense>
    </SlideFade>
  );
};
export default FeedContainer;
