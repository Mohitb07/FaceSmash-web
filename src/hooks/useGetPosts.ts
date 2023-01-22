import { useEffect, useState, useCallback } from 'react';

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

  const getPosts = useCallback(() => {
    setPostsLoading(true);
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('user', '==', userId),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(4)
    );
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
  }, [lastVisible, userId]);

  useEffect(() => {
    // when using pagination have to make a seperate query for total posts count
    let unsubscriber: Unsubscribe;
    try {
      const userPostsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('user', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      unsubscriber = onSnapshot(userPostsQuery, (querySnapshot) => {
        const postList = querySnapshot.docs.map((d) => ({
          ...(d.data() as Post),
          key: d.id,
        }));
        setUserPosts(postList);
        setPostsLoading(false);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setPostsCount(querySnapshot.size);
      });
    } catch (error) {
      console.log('useGetPosts error', error);
      setPostsLoading(false);
    }

    return () => unsubscriber();
  }, [userId]);

  return { userPosts, postsLoading, postsCount, getPosts, lastVisible };
};
