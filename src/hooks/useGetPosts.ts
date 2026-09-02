import type {
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
} from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';

import { FEED_LIMIT } from '@/constant';
import type { Post, User } from '@/interface';

export interface FeedState {
  data: Post[];
  loading: boolean;
  lastVisible: DocumentSnapshot | null;
}

const resolvePostUsers = async (
  docs: (QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>)[]
): Promise<Post[]> => {
  const postUserPromises = docs.map((d) => {
    const userRef = d.data()?.user;
    return userRef ? getDoc(userRef) : Promise.resolve(null);
  });
  const rawResult = await Promise.all(postUserPromises);
  const result: (User | null)[] = rawResult.map((d) =>
    d && d.exists() ? (d.data() as User) : null
  );
  return docs.map((d, index) => {
    const postData = d.data() as Post;
    const author = result[index];
    return {
      ...postData,
      username: author?.username || 'Unknown User',
      userProfile: author?.profilePic || '',
      key: d.id,
    };
  });
};

export const useGetPosts = () => {
  const [posts, setPosts] = useState<FeedState>({
    data: [],
    loading: true,
    lastVisible: null,
  });
  const [error, setError] = useState<FirestoreError>();

  const getPosts = async (initialQuery: Query<DocumentData>) => {
    if (!posts.lastVisible) {
      return;
    }
    setPosts((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const q = query(
        initialQuery,
        startAfter(posts.lastVisible),
        limit(FEED_LIMIT)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setPosts((prev) => ({
          ...prev,
          lastVisible: null,
          loading: false,
        }));
        return;
      }
      const paginatedResult = await resolvePostUsers(querySnapshot.docs);
      setPosts((prev) => {
        const existingKeys = new Set(prev.data.map((p) => p.key));
        const newPosts = paginatedResult.filter(
          (p) => !existingKeys.has(p.key)
        );
        return {
          ...prev,
          data: [...prev.data, ...newPosts],
          lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
          loading: false,
        };
      });
    } catch (err: any) {
      console.log('ERROR in useGetPosts', err);
      setError(err);
      setPosts((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const getInitialPosts = useCallback((q: Query<DocumentData>) => {
    setPosts((prev) => ({ ...prev, loading: true }));
    const unsub = onSnapshot(
      query(q, limit(FEED_LIMIT)),
      async (querySnapshot) => {
        if (querySnapshot.empty) {
          setPosts({
            data: [],
            lastVisible: null,
            loading: false,
          });
          return;
        }
        try {
          const postList = await resolvePostUsers(querySnapshot.docs);
          setPosts({
            data: postList,
            loading: false,
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
          });
        } catch (err: any) {
          console.log('ERROR in resolving post users', err);
          setError(err);
          setPosts((prev) => ({ ...prev, loading: false }));
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

  const updatePostLikes = useCallback((postId: string, delta: number) => {
    setPosts((prev) => ({
      ...prev,
      data: prev.data.map((post) =>
        post.key === postId
          ? { ...post, likes: Math.max(0, (post.likes || 0) + delta) }
          : post
      ),
    }));
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
    updatePostLikes,
    error,
  };
};
