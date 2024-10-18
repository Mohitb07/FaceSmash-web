import type { DocumentReference, Timestamp } from 'firebase/firestore';

export interface User {
  createdAt: string;
  email: string;
  lastSignIn: string;
  profilePic: string;
  qusername: string;
  uid: string;
  username: string;
  bio?: string;
}

export interface Post {
  createdAt: Timestamp | null;
  description: string;
  key: string;
  image?: string;
  likes: number;
  link?: string;
  title: string;
  user: DocumentReference;
  userProfile: string;
  username: string;
  imageRef?: string;
  uid: string;
}

export interface PostFormData {
  title: string;
  description: string;
  link?: string;
  image?: string;
}

export interface FeedProps {
  postImage?: string;
  postTitle: string;
  username: string;
  userProfile: string;
  description: string;
  createdAt: Timestamp | null;
  postId: string;
  userId: string;
  link?: string;
  imageRef?: string;
  likes: number;
  authUserId: string;
  hasLiked: boolean;
  setPostEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
  setImageRef: React.Dispatch<React.SetStateAction<string>>;
  setInitialPostValues: React.Dispatch<React.SetStateAction<PostFormData>>;
  handleLikes: (postId: string) => Promise<void>;
}

export interface PostLikes {
  postId: string;
  likes: boolean;
}

export type ModalType = 'Edit profile' | 'Followers' | 'Following' | null;

export interface CustomFile {
  extension: string;
  id: string;
  preview: { type: 'image'; url: string };
  sizeReadable: string;
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
