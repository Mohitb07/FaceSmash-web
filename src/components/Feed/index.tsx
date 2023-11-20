import {
  Avatar,
  Collapse,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { doc, getDoc, increment, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { BiLink } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { FiBookmark, FiHeart } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { TbMessageCircle2 } from 'react-icons/tb';

import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { FeedProps } from '@/interface';

import { db } from '../../../firebase';
import FeedImage from './FeedImage';

dayjs.extend(relativeTime);

const Feed = ({
  username,
  postImage,
  userProfile,
  createdAt,
  description,
  likes,
  postId,
  postTitle,
  userId,
  imageRef,
  link,
  hasLiked,
  authUserId,
}: FeedProps) => {
  const [show, setShow] = useBoolean();
  const { deletePostWithoutImage, deletePostWithImage } = useHandlePost();

  const handlePostDeletion = async (pid: string, imgRef?: string) => {
    if (authUserId !== userId) return;
    if (postImage && imgRef) {
      await deletePostWithImage(pid, `${authUserId}/posts/${imgRef}`);
    } else {
      await deletePostWithoutImage(pid);
    }
  };

  const handleLikes = async () => {
    const batch = writeBatch(db);
    const postLikesSubColRef = doc(
      db,
      `${USERS_COLLECTION}/${authUserId}/postlikes/${postId}`
    );
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const data = await getDoc(postLikesSubColRef);
    // if the user has liked the post
    if (data.exists()) {
      batch.delete(postLikesSubColRef);
      batch.update(postRef, {
        likes: increment(-1),
      });
    }
    // if the user has not liked the post
    else {
      batch.set(postLikesSubColRef, {
        likes: true,
        postId: postId,
      });
      batch.update(postRef, {
        likes: increment(1),
      });
    }
    batch
      .commit()
      .catch((err) => console.log('some error while liking the post', err));
  };

  return (
    <article className="relative h-auto max-w-2xl rounded-2xl bg-[#242427] pb-5">
      <div>
        <div className="p-4">
          <header className="flex items-center">
            <div className="flex flex-1 items-center space-x-2">
              <div role="button">
                <Link
                  href={{
                    pathname: '/[username]',
                    query: { username, userId },
                  }}
                >
                  <Avatar ignoreFallback size="sm" src={userProfile} />
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  role="button"
                  className="text-sm font-semibold md:text-base"
                >
                  <Link
                    href={{
                      pathname: '/[username]',
                      query: { username, userId },
                    }}
                  >
                    {username}
                  </Link>
                </span>
                <div className="space-x-2 text-xs md:text-base">
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">
                    {dayjs(createdAt?.toDate()).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <nav role="menu">
              {authUserId === userId ? (
                <Menu isLazy closeOnSelect placement="bottom-end">
                  <MenuButton aria-label="Options">
                    <BsThreeDotsVertical className="cursor-pointer text-xl" />
                  </MenuButton>
                  <MenuList backgroundColor="#242526" border="none" padding="2">
                    <MenuItem
                      icon={
                        <img
                          width="24"
                          height="24"
                          src="https://img.icons8.com/ios-glyphs/30/ff0000/filled-trash.png"
                          alt="filled-trash"
                        />
                      }
                      onClick={() => handlePostDeletion(postId, imageRef)}
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: '#40404F',
                        borderRadius: '3px',
                      }}
                    >
                      <button
                        aria-label="delete post"
                        className="bg-none text-gray-400"
                      >
                        Delete Post
                      </button>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </nav>
          </header>
        </div>
        {postImage && (
          <div className="p-4 pt-0">
            <FeedImage postImage={postImage} link={link} />
          </div>
        )}
        <div
          className={`flex flex-col px-4 ${
            !postImage ? 'flex-col-reverse' : ''
          }`}
        >
          <div>
            <div className="flex items-center text-xl md:text-2xl">
              <div className="flex flex-1 space-x-3">
                <section>
                  <span>
                    <button onClick={handleLikes}>
                      {hasLiked ? (
                        <FaHeart className="text-red-500 group-hover:opacity-40" />
                      ) : (
                        <FiHeart className="group-hover:opacity-40" />
                      )}
                    </button>
                  </span>
                </section>
                <section>
                  <span>
                    <button>
                      <TbMessageCircle2 className="-scale-x-100 group-hover:opacity-40" />
                    </button>
                  </span>
                </section>
                <section>
                  <span>
                    <button>
                      <HiOutlinePaperAirplane className="rotate-90 group-hover:opacity-40" />
                    </button>
                  </span>
                </section>
              </div>
              <section>
                <span>
                  <button>
                    <FiBookmark className="group-hover:opacity-40" />
                  </button>
                </span>
              </section>
            </div>

            <div>
              <span className="text-base font-semibold md:text-lg">
                {likes} likes
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {link && !postImage && (
              <div role="link" className="flex justify-start">
                <div className="inline-block cursor-pointer rounded-full bg-slate-600 p-2 opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-80">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <BiLink fontSize={20} />
                  </a>
                </div>
              </div>
            )}
            <p className="text-xl leading-8 md:text-2xl">{postTitle}</p>
            <div>
              <Collapse startingHeight={23} in={show}>
                <p className="text-sm md:text-base">
                  <span className="mr-2 font-semibold tracking-wide">
                    {username}
                  </span>
                  <span>{description}</span>
                </p>
              </Collapse>
              {description.length > 30 && (
                <div role="button">
                  <Text
                    className="inline-block text-base font-bold text-gray-400"
                    onClick={setShow.toggle}
                  >
                    Show {show ? 'Less' : 'More'}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default Feed;
