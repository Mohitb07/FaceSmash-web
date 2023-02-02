import type { Unsubscribe } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

import type { PostValue } from '@/components/SideNavigation/PostModal';
import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { PostLikes, User } from '@/interface';

import { db } from '../../firebase';

export const useHandlePost = () => {
  const [userLikedPosts, setUserLikedPosts] = useState<PostLikes[]>([]);
  const { authUser } = useAuthUser();

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    const getUserLikedPosts = () => {
      const q = query(
        collection(db, `${USERS_COLLECTION}/${authUser?.uid}/postlikes`)
      );
      unsubscriber = onSnapshot(q, (querySnap) => {
        const list = querySnap.docs.map((d) => ({
          ...(d.data() as PostLikes),
        }));
        setUserLikedPosts(list);
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
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    } catch (error) {
      console.log('ERROR while deleting post', error);
    }
  };

  const deletePostWithImage = async (postId: string, postImageRef: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, postImageRef);
    try {
      await deleteObject(imageRef);
      await deletePostWithoutImage(postId);
    } catch (error) {
      console.log('ERROR while deleting post', error);
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
