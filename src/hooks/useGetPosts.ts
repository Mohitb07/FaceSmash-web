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

export interface FeedState {
  data: Post[];
  loading: boolean;
  lastVisible: DocumentSnapshot | null;
}

export const useGetPosts = () => {
  const [posts, setPosts] = useState<FeedState>({
    data: [],
    loading: true,
    lastVisible: null,
  });
  const [error, setError] = useState<FirestoreError>();

  const getPosts = (initialQuery: Query<DocumentData>) => {
    if (!posts.lastVisible) {
      return;
    }
    setPosts((prev) => ({
      ...prev,
      loading: true,
    }));
    const q = query(
      initialQuery,
      startAfter(posts.lastVisible),
      limit(FEED_LIMIT)
    );
    onSnapshot(
      q,
      async (querySnapshot) => {
        if (querySnapshot.empty) {
          setPosts((prev) => ({
            ...prev,
            lastVisible: null,
          }));
        }
        if (!querySnapshot.empty) {
          const postUserPromises = querySnapshot.docs.map((d) =>
            getDoc(d.data().user)
          );
          const rawResult = await Promise.all(postUserPromises);
          const result: User[] = rawResult.map((d) => d.data() as User);
          const paginatedResult = querySnapshot.docs.map((d, index) => {
            return {
              ...(d.data() as Post),
              username: result[index].username,
              userProfile: result[index].profilePic,
              key: d.id,
            };
          });
          setPosts((prev) => ({
            ...prev,
            data: [...posts.data, ...paginatedResult],
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
          }));
        }
        setPosts((prev) => ({
          ...prev,
          loading: false,
        }));
      },
      (err) => {
        console.log('ERROR in useGetPosts', err);
        setError(err);
        setPosts((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    );
  };

  const getInitialPosts = useCallback((q: Query<DocumentData>) => {
    const unsub = onSnapshot(
      query(q, limit(FEED_LIMIT)),
      async (querySnapshot) => {
        if (querySnapshot.empty) {
          setPosts((prev) => ({
            ...prev,
            data: [],
            lastVisible: null,
            loading: false,
          }));
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
          setPosts((prev) => ({
            ...prev,
            data: postList,
            loading: false,
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
          }));
        }
      },
      (err) => {
        console.log('ERROR in getInitialPost', err);
        setError(err);
        setPosts((prev) => ({
          ...prev,
          loading: false,
          lastVisible: null,
        }));
      }
    );
    return unsub;
  }, []);

  const memoizedPosts = useMemo(() => posts.data, [posts.data]);
  const postsLoading = posts.loading;
  const lastVisible = posts.lastVisible;

  return {
    memoizedPosts,
    postsLoading,
    getPosts,
    lastVisible,
    getInitialPosts,
    error,
  };
};
