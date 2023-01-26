import { useEffect, useState, useCallback, useMemo } from 'react';

import {
  query,
  Unsubscribe,
  collection,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentSnapshot,
  startAfter,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import { Post } from '../interface';

export const useGetPosts = (userId: string) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot>();
  const [postsCount, setPostsCount] = useState(0);

  const userQuery = useMemo(
    () =>
      query(
        collection(db, POSTS_COLLECTION),
        where('user', '==', userId),
        orderBy('createdAt', 'desc')
      ),
    [userId]
  );

  const getPosts = useCallback(() => {
    setPostsLoading(true);
    const q = query(userQuery, startAfter(lastVisible), limit(FEED_LIMIT));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const postList = querySnapshot.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setUserPosts((prev) => [...prev, ...postList]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      setPostsLoading(false);
    });
    return unsubscribe;
  }, [lastVisible, userQuery]);

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    let unsubscriberPostsCount: Unsubscribe;
    try {
      unsubscriberPostsCount = onSnapshot(userQuery, (querySnapshot) => {
        setPostsCount(querySnapshot.size);
      });
      const userPostsQuery = query(userQuery, limit(FEED_LIMIT));
      unsubscriber = onSnapshot(userPostsQuery, (querySnapshot) => {
        const postList = querySnapshot.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setUserPosts(postList);
        setPostsLoading(false);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      });
    } catch (error) {
      console.log('useGetPosts error', error);
      setPostsLoading(false);
    }

    return () => {
      unsubscriber(), unsubscriberPostsCount();
    };
  }, [userId, userQuery]);

  return { userPosts, postsLoading, postsCount, getPosts, lastVisible };
};
