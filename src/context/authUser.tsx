import { Spinner } from '@chakra-ui/react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { USERS_COLLECTION } from '@/constant';
import type { User as IUser } from '@/interface';

import { auth, db } from '../../firebase';

type UserState = {
  authUser: IUser | null;
  loading: boolean;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  logout: () => void;
};

const DEFAULT_VALUES: UserState = {
  authUser: null,
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

  const logout = useCallback(() => {
    signOut(auth)
      .then(() => console.log('user Logged out'))
      .catch((err) => console.log('error while logging out', err));
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (user) {
          try {
            const userData = await getDoc(doc(db, USERS_COLLECTION, user.uid));
            if (userData.exists()) {
              setAuthUser(userData.data() as IUser);
            } else {
              setAuthUser(null);
            }
            setIsVerified(user.emailVerified);
            setLoading(false);
          } catch (err) {
            console.log('Auth user error', err);
            setLoading(false);
            setError(`Some Error ${err}`);
          }
        } else {
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
  }, []);

  const values = useMemo(
    () => ({
      authUser,
      loading,
      isVerified,
      setIsVerified,
      error,
      logout,
    }),
    [authUser, loading, isVerified, error, logout]
  );

  if (loading) {
    return (
      <div className="flex-container z-50 h-screen w-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
