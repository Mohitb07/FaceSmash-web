import type { Unsubscribe } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../firebase';
import { USERS_COLLECTION } from '../constant';
import type { User } from '../interface';

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

  useEffect(() => {
    let unsub: Unsubscribe;
    try {
      const userDetailQuery = doc(db, USERS_COLLECTION, userId);
      unsub = onSnapshot(userDetailQuery, (d) => {
        const userData = {
          ...(d.data() as User),
          key: d.id,
        };
        setUserDetail(userData);
        setIsUserDetailLoading(false);
      });
    } catch (error) {
      setIsUserDetailLoading(false);
    }
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return { userDetail, isUserDetailLoading };
};
