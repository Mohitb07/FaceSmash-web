import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { IUserDetail } from '../interface';
import { db } from '../../firebase';
import { useRouter } from 'next/router';

type UserState = IUserDetail | null;

const DEFAULT_VALUES: IUserDetail = {
  createdAt: '',
  email: '',
  lastSignIn: '',
  profilePic: '',
  qusername: '',
  uid: '',
  username: '',
  bio: '',
};

export const UserContext = createContext<UserState>(DEFAULT_VALUES);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<UserState>(DEFAULT_VALUES);
  const auth = getAuth();
  console.log('current status', auth.currentUser)
  useEffect(() => {
    let unsubscribeUser: Unsubscribe;
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const uid = user.uid;
        unsubscribeUser = onSnapshot(
          doc(db, 'Users', uid),
          (doc) => {
            setAuthUser(doc.data() as UserState);
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

  return (
    <UserContext.Provider value={authUser}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
