import { useEffect, useState } from 'react';

import {
  query,
  Unsubscribe,
  collection,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { Post } from '../interface';

export const useGetPosts = (userId: string) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsCount, setPostsCount] = useState(0)
  
  useEffect(() => {
    // when using pagination have to make a seperate query for total posts count
    let unsubscriber: Unsubscribe;
    try {
      const userPostsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('user', '==', userId),
        orderBy('createdAt', 'desc'),
        // limit(FEED_LIMIT)
      );
      unsubscriber = onSnapshot(userPostsQuery, (querySnapshot) => {
        const postList = querySnapshot.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setUserPosts(postList);
        setPostsLoading(false);
        setPostsCount(querySnapshot.size)
      });
    } catch (error) {
      console.log('useGetPosts error', error);
      setPostsLoading(false);
    }

    return () => unsubscriber()
  }, [userId]);

  return {userPosts, postsLoading, postsCount}
};
