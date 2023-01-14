import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { Post } from '../interface';

export const useGetPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const getPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'), limit(FEED_LIMIT));
      const result = await getDocs(q)
      if(result){
        const postList = result.docs.map(d => ({
            ...(d.data() as Post),
            key: d.id,
        }))
        return postList;
      }
      return [];
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getUserPosts, getPosts, isLoading };
};
