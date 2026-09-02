import type {
  DocumentData,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { collection, getDoc, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { USERS_COLLECTION } from '@/constant';
import type { User } from '@/interface';

import { db } from '../../firebase';

type ConnectionsCount = {
  following: number | null;
  followers: number | null;
};

export const useConnection = (userId: string) => {
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionsCount, setConnectionCount] = useState<ConnectionsCount>({
    following: null,
    followers: null,
  });

  const promiseResolver = async (querySnap: QuerySnapshot<DocumentData>) => {
    const validDocRefs = querySnap.docs
      .map((d) => d.data().user)
      .filter(Boolean);
    const promises = validDocRefs.map((docRef) => getDoc(docRef));
    const result = await Promise.all(promises);
    return result.filter((d) => d.exists()).map((d) => d.data() as User);
  };

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return undefined;
    }

    let unsubscribeFollowingData: Unsubscribe | null = null;
    let unsubscribeFollowersData: Unsubscribe | null = null;

    try {
      const followingSubColRef = query(
        collection(db, `${USERS_COLLECTION}/${userId}/followings`)
      );
      unsubscribeFollowingData = onSnapshot(
        followingSubColRef,
        async (querySnap) => {
          const list = await promiseResolver(querySnap);
          setFollowingList(list);
          setConnectionCount((prev) => ({
            ...prev,
            following: querySnap.size,
          }));
        },
        (err) => {
          console.log('ERROR while fetching user following count', err);
          setIsLoading(false);
        }
      );

      const followersSubColRef = query(
        collection(db, `${USERS_COLLECTION}/${userId}/followers`)
      );
      unsubscribeFollowersData = onSnapshot(
        followersSubColRef,
        async (querySnap) => {
          const list = await promiseResolver(querySnap);
          setFollowersList(list);
          setConnectionCount((prev) => ({
            ...prev,
            followers: querySnap.size,
          }));
          setIsLoading(false);
        },
        (err) => {
          console.log('ERROR while fetching user followers count', err);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.log('ERROR setting up connections listener', error);
      setIsLoading(false);
    }

    return () => {
      if (typeof unsubscribeFollowingData === 'function') {
        unsubscribeFollowingData();
      }
      if (typeof unsubscribeFollowersData === 'function') {
        unsubscribeFollowersData();
      }
    };
  }, [userId]);

  return { connectionsCount, followersList, followingList, isLoading };
};
