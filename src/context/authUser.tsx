import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { IUserDetail } from '../interface';
import { db } from '../../firebase';
import { Spinner } from '@chakra-ui/react';

type UserState = { authUser: IUserDetail | null; loading: boolean };

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
};

export const UserContext = createContext<UserState>(DEFAULT_VALUES);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<IUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  console.log('current status', auth.currentUser);

  useEffect(() => {
    let unsubscribeUser: Unsubscribe;
    let unsubscribeAuth: Unsubscribe;
    try {
      unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          const uid = user.uid;
          unsubscribeUser = onSnapshot(
            doc(db, 'Users', uid),
            (doc) => {
              setAuthUser(doc.data() as IUserDetail);
              setLoading(false)
            },
            (error) => {
              console.log('ERROR FOUND ', error);
              setLoading(false)
            }
          );
        } else {
          console.log('user is logged out, setting load false');
          setAuthUser(null);
          setLoading(false)
        }
      });
    } catch (error) {
      console.log('Error ', error);
      setLoading(false)
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
    <div className="h-screen w-screen z-50 flex justify-center items-center bg-green-500">
      <Spinner size="xl" />
    </div>;
  }

  return (
    <UserContext.Provider value={{ authUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
