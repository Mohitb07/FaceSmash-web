import { useDisclosure } from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import React, { lazy, Suspense, useEffect, useState } from 'react';

import { useConnection } from '@/hooks/useConnection';
import type { ModalType } from '@/interface';

const ConnectionModal = lazy(() => import('@/components/ConnectionsModal'));

type UserConnectionsProps = {
  userQuery: Query<DocumentData>;
  userId: string;
};

const UserConnections = ({ userQuery, userId }: UserConnectionsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [postsCount, setPostsCount] = useState(0);
  const { connectionsCount, followersList, followingList } =
    useConnection(userId);

  useEffect(() => {
    let unsubscriber = onSnapshot(
      userQuery,
      (querySnapshot) => {
        console.log(querySnapshot.docs);
        setPostsCount(querySnapshot.size);
      },
      (err) => console.log('ERROR while fetching user posts count', err)
    );
    return () => {
      unsubscriber();
    };
  }, [userId]);

  const handleModalOpen = (type: ModalType) => {
    setModalType(type);
    onOpen();
  };

  return (
    <>
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

      <Suspense fallback={<></>}>
        {isOpen && modalType !== 'Edit profile' && (
          <ConnectionModal
            data={modalType === 'Followers' ? followersList : followingList}
            title={modalType!}
            onClose={onClose}
            isOpen={isOpen}
          />
        )}
      </Suspense>
    </>
  );
};
export default UserConnections;
