import type { DocumentData, DocumentSnapshot, Query } from 'firebase/firestore';
import {
  getDoc,
  limit,
  onSnapshot,
  query,
  startAfter,
} from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';

import { FEED_LIMIT } from '@/constant';
import type { Post, User } from '@/interface';

export const useGetPosts = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot>();

  const getPosts = useCallback(
    (initialQuery: Query<DocumentData>) => {
      setPostsLoading(true);
      const q = query(initialQuery, startAfter(lastVisible), limit(FEED_LIMIT));
      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const postUserPromises = querySnapshot.docs.map((d) =>
              getDoc(d.data().user)
            );
            const rawResult = await Promise.all(postUserPromises);
            const result: User[] = rawResult.map((d) => d.data() as User);
            const postList = querySnapshot.docs.map((d, index) => {
              return {
                ...(d.data() as Post),
                username: result[index].username,
                userProfile: result[index].profilePic,
                key: d.id,
              };
            });
            setUserPosts((prev) => [...prev, ...postList]);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          }
          setPostsLoading(false);
        },
        (err) => {
          console.log('ERROR in useGetPosts', err);
          setPostsLoading(false);
        }
      );
      return unsubscribe;
    },
    [lastVisible]
  );

  const getInitialPosts = useCallback((q: Query<DocumentData>) => {
    setPostsLoading(true);
    const unsub = onSnapshot(
      query(q, limit(FEED_LIMIT)),
      async (querySnapshot) => {
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
          setUserPosts(postList);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
        setPostsLoading(false);
      },
      (err) => {
        console.log('ERROR in getInitialPost', err);
        setPostsLoading(false);
      }
    );
    return unsub;
  }, []);

  const memoizedPosts = useMemo(() => userPosts, [userPosts]);

  return {
    memoizedPosts,
    postsLoading,
    getPosts,
    lastVisible,
    getInitialPosts,
  };
};
