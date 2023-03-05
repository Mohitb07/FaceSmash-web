import type {
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  Query,
} from 'firebase/firestore';
import { startAfter } from 'firebase/firestore';
import { getDoc, limit, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';

import { FEED_LIMIT } from '@/constant';
import type { Post, User } from '@/interface';

type DataType = 'Initial' | 'Paginated';

export const useGetPosts = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot>();
  const [error, setError] = useState<FirestoreError>();

  const getData = (q: Query<DocumentData>, type: DataType) => {
    setPostsLoading(true);
    const unsub = onSnapshot(
      q,
      async (querySnapshot) => {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        console.log('refetch thing');
        if (querySnapshot.empty) {
          if (type === 'Initial') {
            setUserPosts([]);
          }
        }
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
          if (type === 'Initial') {
            setUserPosts(postList);
          }
          if (type === 'Paginated') {
            setUserPosts((prev) => [...prev, ...postList]);
          }
        }
        setPostsLoading(false);
      },
      (err) => {
        console.log('ERROR in getInitialPost', err);
        setError(err);
        setPostsLoading(false);
      }
    );
    return unsub;
  };

  const getPosts = useCallback(
    (q: Query<DocumentData>) => {
      const unsub = getData(
        query(q, limit(FEED_LIMIT), startAfter(lastVisible)),
        'Paginated'
      );
      return unsub;
    },
    [lastVisible]
  );

  const getInitialPosts = useCallback((q: Query<DocumentData>) => {
    const unsub = getData(query(q, limit(FEED_LIMIT)), 'Initial');
    return unsub;
  }, []);

  const memoizedPosts = useMemo(() => userPosts, [userPosts]);

  return {
    memoizedPosts,
    postsLoading,
    getPosts,
    lastVisible,
    getInitialPosts,
    error,
  };
};
