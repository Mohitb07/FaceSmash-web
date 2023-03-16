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
    const promises = querySnap.docs.map((d) => getDoc(d.data().user));
    const result = await Promise.all(promises);
    return result.map((d) => d.data() as User);
  };

  useEffect(() => {
    let unsubscribeFollowingData: Unsubscribe;
    let unsubscribeFollowersData: Unsubscribe;
    async function getData() {
      const followingSubColRef = query(
        collection(db, `${USERS_COLLECTION}/${userId}/followings/`)
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
          console.log('ERROR while fetching user posts count', err);
          setIsLoading(false);
        }
      );

      const followersSubColRef = query(
        collection(db, `${USERS_COLLECTION}/${userId}/followers/`)
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
          console.log('ERROR while fetching user posts count', err);
          setIsLoading(false);
        }
      );
    }
    getData();
    return () => {
      unsubscribeFollowingData();
      unsubscribeFollowersData();
    };
  }, [userId]);

  return { connectionsCount, followersList, followingList, isLoading };
};
