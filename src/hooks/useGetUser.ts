import { useCallback, useEffect, useState } from 'react';

import { doc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

import { db } from '../../firebase';
import { USERS_COLLECTION } from '../constant';
import { User } from '../interface';
import { useAuthUser } from './useAuthUser';

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

export const useGetUser = (userId: string) => {
  const [userDetail, setUserDetail] = useState<User>(DEFAULT_USER_DETAILS);
  const [isUserDetailLoading, setIsUserDetailLoading] = useState(true);
  const { authUser } = useAuthUser();

  useEffect(() => {
    let unsub: Unsubscribe;
    try {
      const userDetailQuery = doc(db, USERS_COLLECTION, userId);
      unsub = onSnapshot(userDetailQuery, (doc) => {
        const userData = {
          ...(doc.data() as User),
          key: doc.id,
        };
        setUserDetail(userData);
        setIsUserDetailLoading(false);
      });
    } catch (error) {
      setIsUserDetailLoading(false);
    }
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, authUser?.uid]);
  return { userDetail, isUserDetailLoading };
};
