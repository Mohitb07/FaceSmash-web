import type { Unsubscribe } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

import type { PostValue } from '@/components/SideNavigation/PostModal';
import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { User } from '@/interface';

import { db } from '../../firebase';

export const useHandlePost = () => {
  const [userLikedPosts, setUserLikedPosts] = useState<Set<string>>(new Set());
  const { authUser } = useAuthUser();

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    const getUserLikedPosts = () => {
      const q = query(
        collection(db, `${USERS_COLLECTION}/${authUser?.uid}/postlikes`)
      );
      unsubscriber = onSnapshot(q, (querySnap) => {
        const list: string[] = querySnap.docs.map((d) => d.data().postId);
        const setList = new Set(list);
        setUserLikedPosts(setList);
      });
    };
    getUserLikedPosts();
    return () => {
      unsubscriber();
    };
  }, [authUser?.uid]);

  const createPostWithImage = async (
    user: User,
    url: string,
    data: PostValue,
    cb?: () => void
  ) => {
    await addDoc(collection(db, POSTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      image: url,
      likes: 0,
      user: doc(db, `/${USERS_COLLECTION}/${user.uid}`),
      uid: user.uid,
    });
    if (typeof cb === 'function') {
      cb();
    }
  };

  const createPostWithoutImage = async (
    user: User,
    data: PostValue,
    cb?: () => void
  ) => {
    await addDoc(collection(db, POSTS_COLLECTION), {
      ...data,
      image: null,
      imageRef: null,
      createdAt: serverTimestamp(),
      likes: 0,
      user: doc(db, `/${USERS_COLLECTION}/${user.uid}`),
      uid: user.uid,
    });
    if (typeof cb === 'function') {
      cb();
    }
  };

  const deletePostWithoutImage = async (postId: string) => {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    try {
      await deleteDoc(postRef);
    } catch (error) {
      console.log('ERROR while deleting post', error);
    }
  };

  const backupPost = async (postId: string) => {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const data = await getDoc(docRef);
    if (!data.exists()) {
      throw new Error('Post does not exist');
    }
    const post = data.data();
    return post;
  };

  const deletePostWithImage = async (postId: string, postImageRef: string) => {
    const backup = await backupPost(postId);
    const storage = getStorage();
    const imageRef = ref(storage, postImageRef);
    const docRef = doc(db, POSTS_COLLECTION, postId);
    let isPostDeleted = false;
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        if (!sfDoc.exists()) {
          throw new Error('Post does not exist!');
        }
        transaction.delete(docRef);
      });
      isPostDeleted = true;
      await deleteObject(imageRef);
    } catch (error) {
      console.log('ERROR while deleting post', error);
      if (isPostDeleted) {
        await addDoc(collection(db, POSTS_COLLECTION), backup);
        console.log('backup error', backup);
      }
    }
  };

  return {
    createPostWithImage,
    createPostWithoutImage,
    deletePostWithoutImage,
    deletePostWithImage,
    userLikedPosts,
  };
};
