import {Dispatch, SetStateAction} from 'react';

import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { User as IUser } from '../interface';
import { db } from '../../firebase';
import { Spinner } from '@chakra-ui/react';

type UserState = {
  authUser: IUser | null;
  loading: boolean;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
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
};

export const UserContext = createContext<UserState>(DEFAULT_VALUES);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  console.log('current status', isVerified);

  useEffect(() => {
    let unsubscribeUser: Unsubscribe;
    let unsubscribeAuth: Unsubscribe;
    try {
      unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          console.log('isVerified', user.emailVerified);
          const uid = user.uid;
          unsubscribeUser = onSnapshot(
            doc(db, 'Users', uid),
            (doc) => {
              setAuthUser(doc.data() as IUser);
              setIsVerified(user.emailVerified);
              setLoading(false);
            },
            (error) => {
              console.log('ERROR FOUND ', error);
              setLoading(false);
            }
          );
        } else {
          console.log('user is logged out, setting load false');
          setAuthUser(null);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log('Error ', error);
      setLoading(false);
    }

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
    <div className="h-screen w-screen z-50 flex justify-center items-center">
      <Spinner size="xl" />
    </div>;
  }

  return (
    <UserContext.Provider value={{ authUser, loading, isVerified, setIsVerified }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
