import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import {
  collection,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { db } from '../../firebase';
import { FEED_LIMIT, POSTS_COLLECTION } from '../constant';
import type { Post, User } from '../interface';

export const useGetPosts = (userId: string) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot>();
  const [postsCount, setPostsCount] = useState(0);

  const userQuery = useMemo(
    () =>
      query(
        collection(db, POSTS_COLLECTION),
        where('uid', '==', userId),
        orderBy('createdAt', 'desc')
      ),
    [userId]
  );

  const getPosts = useCallback(() => {
    setPostsLoading(true);
    const q = query(userQuery, startAfter(lastVisible), limit(FEED_LIMIT));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (!querySnapshot.empty) {
        const postUserPromises = querySnapshot.docs.map((d) =>
          getDoc(d.data().user)
        );
        const rawResult = await Promise.all(postUserPromises);
        const result: User[] = rawResult.map((d) => d.data() as User);
        const postList = querySnapshot.docs.map((d, index) => ({
          ...(d.data() as Post),
          username: result[index].username,
          userProfile: result[index].profilePic,
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
      unsubscriber = onSnapshot(userPostsQuery, async (querySnapshot) => {
        const postUserPromises = querySnapshot.docs.map((d) =>
          getDoc(d.data().user)
        );
        const rawResult = await Promise.all(postUserPromises);
        const result: User[] = rawResult.map((d) => d.data() as User);
        console.log('result', result);
        const postList = querySnapshot.docs.map((d, index) => ({
          ...(d.data() as Post),
          username: result[index].username,
          userProfile: result[index].profilePic,
          key: d.id,
        }));
        console.log('effect list', postList);
        setUserPosts(postList);
        setPostsLoading(false);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      });
    } catch (error) {
      console.log('useGetPosts error', error);
      setPostsLoading(false);
    }

    return () => {
      unsubscriber();
      unsubscriberPostsCount();
    };
  }, [userId, userQuery]);

  return { userPosts, postsLoading, postsCount, getPosts, lastVisible };
};
