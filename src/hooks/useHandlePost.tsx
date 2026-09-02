import { useToast } from '@chakra-ui/react';
import type { Unsubscribe } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';

import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { CustomFile, User } from '@/interface';

import { db } from '../../firebase';

type PostCreationFormData = {
  title: string;
  description: string;
  image?: CustomFile | null;
  link?: string;
  imageRef?: string;
};

export const useHandlePost = () => {
  const [userLikedPosts, setUserLikedPosts] = useState<Set<string>>(new Set());
  const { authUser } = useAuthUser();
  const toast = useToast();

  useEffect(() => {
    let unsubscriber: Unsubscribe;
    const getUserLikedPosts = () => {
      const q = query(
        collection(db, `${USERS_COLLECTION}/${authUser?.uid}/postlikes`)
      );
      unsubscriber = onSnapshot(
        q,
        (querySnap) => {
          const list: string[] = querySnap.docs.map((d) => d.data().postId);
          const setList = new Set(list);
          setUserLikedPosts(setList);
        },
        (err) => {
          console.log('error while fetching user liked posts', err);
        }
      );
    };
    getUserLikedPosts();
    return () => {
      unsubscriber();
    };
  }, [authUser?.uid]);

  const createPostWithImage = async (
    user: User,
    url: string,
    data: PostCreationFormData,
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

  const updatePost = async (
    postId: string,
    url: string,
    data: PostCreationFormData,
    cb?: () => void
  ) => {
    console.log('updatePost', postId, url, data);
    const postDocRef = doc(db, POSTS_COLLECTION, postId); // Replace 'posts' with your collection name and id with your document ID
    try {
      await updateDoc(postDocRef, {
        ...data,
        image: url,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: `Post updated successfully`,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'purple',
        icon: <TiTick className="text-2xl" />,
      });
      if (typeof cb === 'function') {
        cb();
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      toast({
        title: 'Something went wrong',
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'purple',
        icon: <MdErrorOutline className="text-2xl" />,
      });
    }
  };

  const createPostWithoutImage = async (
    user: User,
    data: PostCreationFormData,
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
      toast({
        title: 'Failed to delete post',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const deletePostWithImage = async (
    postId: string,
    _postImageRef?: string
  ) => {
    await deletePostWithoutImage(postId);
  };

  return {
    createPostWithImage,
    createPostWithoutImage,
    deletePostWithoutImage,
    deletePostWithImage,
    userLikedPosts,
    updatePost,
  };
};
