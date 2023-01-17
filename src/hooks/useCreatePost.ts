import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { db } from '../../firebase';
import { PostValue } from '../components/SideNavigation/PostModal';
import { POSTS_COLLECTION } from '../constant';
import { User } from '../interface';

export const useCreatePost = () => {
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
      user: user.uid,
      userProfile: user.profilePic,
      username: user.username,
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
      user: user.uid,
      userProfile: user.profilePic,
      username: user.username,
    });
    if (typeof cb === 'function') {
      cb();
    }
  };

  const deletePostWithoutImage = async (postId: string) => {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, postId));
      console.log('post deleted successfully');
    } catch (error) {
      console.log('some error while deleting post', error);
    }
  };

  const deletePostWithImage = async (postId: string, postImageRef: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, postImageRef);
    try {
      await deleteObject(imageRef);
      console.log('image deleted');
      await deletePostWithoutImage(postId);
      console.log('post deleted successfully');
    } catch (error) {
      console.log('some error while deleting post', error);
    }
  };

  return {
    createPostWithImage,
    createPostWithoutImage,
    deletePostWithoutImage,
    deletePostWithImage,
  };
};
