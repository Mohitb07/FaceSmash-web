import { useContext } from 'react';
import { UserContext } from '../context/user';

export const useAuthUser = () => {
  return useContext(UserContext);
};
