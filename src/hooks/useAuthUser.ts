import { useContext } from 'react';

import { UserContext } from '@/context/authUser';

export const useAuthUser = () => {
  return useContext(UserContext);
};
