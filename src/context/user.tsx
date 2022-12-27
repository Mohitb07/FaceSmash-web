import { useAuthUser } from '@react-query-firebase/auth';
import {
  doc
} from 'firebase/firestore';
import {
  createContext,
  ReactNode
} from 'react';

import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { auth, firestore } from '../../firebase';
import { IUserDetail } from '../interface';

type UserState = IUserDetail | null;

export const UserContext = createContext<UserState>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const authUser = useAuthUser(['user'], auth);
  let ref;
  if (authUser?.data?.uid) {
    ref = doc(firestore, 'Users', authUser.data?.uid);
  }

  const userData = useFirestoreDocument(['Users', authUser.data?.uid], ref);
  return <UserContext.Provider value={userData.data?.data() as UserState}>{children}</UserContext.Provider>;
};

export default UserProvider;
