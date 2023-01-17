import {
  collection,
  getDocs,
  limit, orderBy,
  query,
  where
} from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';

export const useGetPosts = () => {
  const getUserPosts = useCallback((userId: string) => {
    try {
      const userPostsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('user', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(FEED_LIMIT)
      );
      return getDocs(userPostsQuery);
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  return { getUserPosts };
};
