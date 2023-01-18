import {Timestamp} from 'firebase/firestore'

export interface User {
    createdAt: string
    email: string
    lastSignIn: string
    profilePic: string
    qusername: string
    uid: string
    username: string
    bio?: string
  }

  export interface Post {
    createdAt: Timestamp | null
    description: string
    key: string
    image?: string
    likes: number
    link?: string
    title: string
    user: string
    userProfile: string
    username: string
    imageRef?: string
  }

  export interface FeedProps {
    postImage?: string
    postTitle: string
    username: string
    userProfile: string
    description: string
    createdAt: Timestamp | null
    postId: string
    userId: string
    link?: string
    imageRef?: string
    likes: number
    authUserId: string
    hasLiked: boolean
  }

  export interface PostLikes {
    postId: string
    likes: boolean
  }