import { Spinner } from '@chakra-ui/react';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { FirestoreError, Unsubscribe } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import type { Dispatch, SetStateAction } from 'react';
import type { ReactNode } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

import { USERS_COLLECTION } from '@/constant';
import type { User as IUser } from '@/interface';

import { db } from '../../firebase';

type UserState = {
  authUser: IUser | null;
  loading: boolean;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  error: FirestoreError | null;
};

const DEFAULT_VALUES: UserState = {
  authUser: {
    createdAt: '',
    email: '',
    lastSignIn: '',
    profilePic: '',
    qusername: '',
    uid: '',
    username: '',
    bio: '',
  },
  loading: true,
  isVerified: false,
  setIsVerified() {},
  error: null,
};

export const UserContext = createContext<UserState>(DEFAULT_VALUES);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const auth = getAuth();
  console.log('current status', isVerified);

  useEffect(() => {
    let unsubscribeUser: Unsubscribe;
    let unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        console.log('isVerified', user.emailVerified);
        const uid = user.uid;
        unsubscribeUser = onSnapshot(
          doc(db, USERS_COLLECTION, uid),
          (d) => {
            setAuthUser(d.data() as IUser);
            setIsVerified(user.emailVerified);
            setLoading(false);
          },
          (err) => {
            console.log('ERROR FOUND ', error);
            setLoading(false);
            setError(err);
          }
        );
      } else {
        console.log('user is logged out, setting load false');
        setAuthUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    <div className="z-50 flex h-screen w-screen items-center justify-center">
      <Spinner size="xl" />
    </div>;
  }
  const values = useMemo(
    () => ({
      authUser,
      loading,
      isVerified,
      setIsVerified,
      error,
    }),
    [authUser, loading, isVerified, setIsVerified, error]
  );
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
