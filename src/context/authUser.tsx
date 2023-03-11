import { Spinner } from '@chakra-ui/react';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
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
  error: string | null;
  logout: () => void;
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
  logout() {},
};

export const UserContext = createContext<UserState>(DEFAULT_VALUES);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => console.log('user Logged out'))
      .catch((err) => console.log('error while logging out', err));
  };

  useEffect(() => {
    let unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (user) {
          console.log('isVerified', user.emailVerified);
          try {
            const userData = await getDoc(doc(db, USERS_COLLECTION, user.uid));
            setAuthUser(userData.data() as IUser);
            setIsVerified(user.emailVerified);
            setLoading(false);
          } catch (err) {
            console.log('Auth user error', error);
            setLoading(false);
            setError(`Some Error ${err}`);
          }
        } else {
          console.log('user is logged out, setting load false');
          setAuthUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    <div className="flex-container z-50 h-screen w-screen">
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
      logout,
    }),
    [authUser, loading, isVerified, setIsVerified, error, logout]
  );
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
