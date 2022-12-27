import { Spinner } from '@chakra-ui/react';
import { useAuthUser } from '@react-query-firebase/auth';
import { User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useState } from 'react';

import { auth } from '../../firebase';

type UserState = User | null;

export const AuthUserContext = createContext<UserState>(null);

const AuthUserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<UserState>(null);
  useAuthUser(['user'], auth, {
    onSuccess(user) {
      if (user) {
        console.log('User is authenticated!', user);
        setAuthUser(user);
      }
    },
    onError(error) {
      console.error(
        'Failed to subscribe to users authentication state!',
        error
      );
    },
  });

  if(!authUser){
    <Spinner size="xl"/>
  }

  return (
    <AuthUserContext.Provider value={authUser}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserProvider;
