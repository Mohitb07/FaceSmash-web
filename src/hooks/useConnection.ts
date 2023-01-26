import { useEffect, useState } from 'react';

import {
  collection,
  getDoc,
  onSnapshot,
  query,
  Unsubscribe,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { USERS_COLLECTION } from '../constant';
import { User } from '../interface';

export const useConnection = (userId: string) => {
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [connectionsCount, setConnectionCount] = useState({
    following: 0,
    followers: 0,
  });

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
          const promises = querySnap.docs.map((d) => getDoc(d.data().user));
          const result = await Promise.all(promises);
          const list = result.map((d) => d.data() as User);
          setFollowingList(list);
          setConnectionCount(prev => ({
            ...prev,
            following: querySnap.size
          }))
        }
      );

      const followersSubColRef = query(
        collection(db, `${USERS_COLLECTION}/${userId}/followers/`)
      );
      unsubscribeFollowersData = onSnapshot(
        followersSubColRef,
        async (querySnap) => {
          const promises = querySnap.docs.map((d) => getDoc(d.data().user));
          const result = await Promise.all(promises);
          const list = result.map((d) => d.data() as User);
          setFollowersList(list);
          setConnectionCount(prev => ({
            ...prev,
            followers: querySnap.size
          }))
        }
      );
    }
    getData();
    return () => {
      unsubscribeFollowingData(), unsubscribeFollowersData();
    };
  }, [userId]);

  return {connectionsCount, followersList, followingList}
};
