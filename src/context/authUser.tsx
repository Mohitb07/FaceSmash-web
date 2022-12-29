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
            },
            (error) => {
              console.log('ERROR FOUND ', error);
            }
          );
        } else {
          console.log('user is logged out');
          setAuthUser(null);
        }
      });
    } catch (error) {
      console.log('Error ', error);
    } finally {
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
    <Spinner size="xl" />;
  }

  return (
    <UserContext.Provider value={{ authUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
