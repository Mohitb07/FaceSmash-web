import { Skeleton, useDisclosure } from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';
import React, { lazy, Suspense, useEffect, useState } from 'react';

import { POSTS_COLLECTION } from '@/constant';
import { useConnection } from '@/hooks/useConnection';
import type { ModalType } from '@/interface';

import { db } from '../../../../firebase';

const ConnectionModal = lazy(() => import('@/components/ConnectionsModal'));

type UserConnectionsProps = {
  userQuery: Query<DocumentData>;
  userId: string;
  isMobile?: boolean;
};

const UserConnections = ({ userId, isMobile }: UserConnectionsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [postsCount, setPostsCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    connectionsCount,
    followersList,
    followingList,
    isLoading: isConnectionsCountLoading,
  } = useConnection(userId);

  useEffect(() => {
    let isMounted = true;
    const fetchPostsCount = async () => {
      if (!userId) {
        if (isMounted) setIsLoading(false);
        return;
      }
      try {
        const countQuery = query(
          collection(db, POSTS_COLLECTION),
          where('uid', '==', userId)
        );
        const snapshot = await getCountFromServer(countQuery);
        if (isMounted) {
          setPostsCount(snapshot.data().count);
          setIsLoading(false);
        }
      } catch (err) {
        console.log('Error while fetching user posts count', err);
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPostsCount();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleModalOpen = (type: ModalType) => {
    setModalType(type);
    onOpen();
  };

  const isStatsLoading = isLoading || isConnectionsCountLoading;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 text-sm font-normal text-zinc-400">
        {/* Following */}
        <button
          onClick={() => handleModalOpen('Followings')}
          className="flex items-center gap-1 transition-colors hover:text-white"
        >
          <Skeleton isLoaded={!isStatsLoading} display="inline-block">
            <span className="font-bold text-zinc-100">
              {connectionsCount.following ?? 0}
            </span>
          </Skeleton>
          <span>Following</span>
        </button>

        {/* Followers */}
        <button
          onClick={() => handleModalOpen('Followers')}
          className="flex items-center gap-1 transition-colors hover:text-white"
        >
          <Skeleton isLoaded={!isStatsLoading} display="inline-block">
            <span className="font-bold text-zinc-100">
              {connectionsCount.followers ?? 0}
            </span>
          </Skeleton>
          <span>Followers</span>
        </button>

        {/* Posts */}
        <div className="flex items-center gap-1">
          <Skeleton isLoaded={!isStatsLoading} display="inline-block">
            <span className="font-bold text-zinc-100">{postsCount ?? 0}</span>
          </Skeleton>
          <span>Posts</span>
        </div>
      </div>

      <Suspense fallback={<></>}>
        {isOpen && modalType !== 'Edit profile' && (
          <ConnectionModal
            isMobile={isMobile}
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
