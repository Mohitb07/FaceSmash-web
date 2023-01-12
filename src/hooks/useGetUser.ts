import { doc, getDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '../../firebase';
import { USERS_COLLECTION } from '../constant';

export const useGetUser = () => {
  const getUserDetail = useCallback((userId: string) => {
    try {
      const userDetailQuery = doc(db, USERS_COLLECTION, userId);
      return getDoc(userDetailQuery);
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);
  return { getUserDetail };
};
