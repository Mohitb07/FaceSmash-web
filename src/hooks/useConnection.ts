import type {
  DocumentData,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { collection, getDoc, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../firebase';
import { USERS_COLLECTION } from '../constant';
import type { User } from '../interface';

export const useConnection = (userId: string) => {
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [connectionsCount, setConnectionCount] = useState({
    following: 0,
    followers: 0,
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
        }
      );
    }
    getData();
    return () => {
      unsubscribeFollowingData();
      unsubscribeFollowersData();
    };
  }, [userId]);

  return { connectionsCount, followersList, followingList };
};
