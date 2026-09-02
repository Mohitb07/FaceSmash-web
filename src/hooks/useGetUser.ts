import type { Unsubscribe } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { USERS_COLLECTION } from '@/constant';
import type { User } from '@/interface';

import { db } from '../../firebase';

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
    if (!userId) {
      setIsUserDetailLoading(false);
      return undefined;
    }

    let unsub: Unsubscribe | null = null;
    try {
      const userDetailQuery = doc(db, USERS_COLLECTION, userId);
      unsub = onSnapshot(
        userDetailQuery,
        (d) => {
          if (d.exists()) {
            const userData = {
              ...(d.data() as User),
              key: d.id,
            };
            setUserDetail(userData);
          } else {
            setUserDetail(DEFAULT_USER_DETAILS);
          }
          setIsUserDetailLoading(false);
        },
        (err) => {
          console.log('Error fetching user detail', err);
          setIsUserDetailLoading(false);
        }
      );
    } catch (error) {
      console.log('Error setting up user detail listener', error);
      setIsUserDetailLoading(false);
    }

    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, [userId]);

  return { userDetail, isUserDetailLoading };
};
