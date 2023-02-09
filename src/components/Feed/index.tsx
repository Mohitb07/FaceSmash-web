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
import Image from 'next/image';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { FiBookmark, FiHeart } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { MdDeleteOutline } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { FeedProps } from '@/interface';

import { db } from '../../../firebase';

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
  // link,
  hasLiked,
  authUserId,
}: FeedProps) => {
  const [show, setShow] = useBoolean();
  const [paddingTop, setPaddingTop] = useState('0');
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
    // <div className="rounded-md bg-[#242526] md:w-[500px] lg:w-[450px] xl:w-[600px]">
    //   <header className="flex h-[4rem] items-center justify-between p-3 md:h-[5rem]">
    //     {userProfile && username && (
    //       <Link
    //         href={{
    //           pathname: '/[username]',
    //           query: { username, userId },
    //         }}
    //       >
    //         <div className="flex cursor-pointer items-center space-x-3">
    //           <Avatar ignoreFallback size="sm" src={userProfile || ''} />
    //           <p className="font-bold">{username}</p>
    //         </div>
    //       </Link>
    //     )}
    //     {authUserId === userId ? (
    //       <Menu isLazy closeOnSelect placement="bottom-end">
    //         <MenuButton aria-label="Options">
    //           <BsThreeDotsVertical className="cursor-pointer text-xl" />
    //         </MenuButton>
    //         <MenuList backgroundColor="#242526" border="none" padding="2">
    //           <MenuItem
    //             icon={<MdDeleteOutline className="text-lg" />}
    //             onClick={() => handlePostDeletion(postId, imageRef)}
    //             backgroundColor="transparent"
    //             _hover={{ backgroundColor: '#40404F', borderRadius: '3px' }}
    //           >
    //             <span className="text-gray-400">Delete Post</span>
    //           </MenuItem>
    //         </MenuList>
    //       </Menu>
    //     ) : null}
    //   </header>
    //   {postImage && (
    //     <div className="relative aspect-auto min-h-[600px]">
    //       <Image
    //         src={postImage}
    //         alt="post image"
    //         blurDataURL={postImage}
    //         layout="fill"
    //       />
    //       {link && (
    //         <div className="absolute top-3 right-3 cursor-pointer rounded-full bg-slate-600 p-2 opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-80">
    //           <a href={link} target="_blank" rel="noopener noreferrer">
    //             <BiLink fontSize={20} />
    //           </a>
    //         </div>
    //       )}
    //     </div>
    //   )}
    //   <div className="space-y-3 p-4 md:space-y-5">
    //     <div
    //       className={`flex flex-col ${!postImage ? 'flex-col-reverse' : ''}`}
    //     >
    //       <div>
    //         <div className="flex items-center justify-between space-y-3 text-2xl md:space-y-5 md:text-3xl">
    //           <div className="flex items-center space-x-2 md:space-x-5">
    //             <div className="group cursor-pointer" onClick={handleLikes}>
    //               {hasLiked ? (
    //                 <FaHeart className="text-red-500 group-hover:opacity-40" />
    //               ) : (
    //                 <FiHeart className="group-hover:opacity-40" />
    //               )}
    //             </div>
    //             <div className="group cursor-pointer">
    //               <TbMessageCircle2 className="-scale-x-100 group-hover:opacity-40" />
    //             </div>
    //             <div className="group cursor-pointer">
    //               <HiOutlinePaperAirplane className="rotate-90 group-hover:opacity-40" />
    //             </div>
    //           </div>
    //           <div className="group cursor-pointer">
    //             <FiBookmark className="group-hover:opacity-40" />
    //           </div>
    //         </div>
    //         <div>
    //           <span className="text-base font-semibold md:text-xl">
    //             {likes} likes
    //           </span>
    //         </div>
    //       </div>
    //       <div className="space-y-3">
    //         {link && !postImage && (
    //           <div className="flex justify-start">
    //             <div className="inline-block cursor-pointer rounded-full bg-slate-600 p-2 opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-80">
    //               <a href={link} target="_blank" rel="noopener noreferrer">
    //                 <BiLink fontSize={20} />
    //               </a>
    //             </div>
    //           </div>
    //         )}
    //         {link ? (
    //           <div className="inline-block">
    //             <a href={link} target="_blank" rel="noopener noreferrer">
    //               <Text fontSize="2xl">{postTitle}</Text>
    //             </a>
    //           </div>
    //         ) : (
    //           <Text fontSize="2xl">{postTitle}</Text>
    //         )}
    //         <Collapse startingHeight={25} in={show}>
    //           <p className="text-base md:text-base">
    //             <span className="mr-2 font-semibold tracking-wide">
    //               {username}
    //             </span>
    //             <span>{description}</span>
    //           </p>
    //         </Collapse>
    //         {description.length > 30 && (
    //           <Text
    //             className="cursor-pointer font-bold text-gray-400"
    //             mt={2}
    //             onClick={handleToggle}
    //           >
    //             Show {show ? 'Less' : 'More'}
    //           </Text>
    //         )}
    //       </div>
    //     </div>
    //     <div>
    //       <span className="text-sm text-slate-400 md:text-base">
    //         {dayjs(createdAt?.toDate()).fromNow()}
    //       </span>
    //     </div>
    //   </div>
    // </div>
    <article className="bg-color relative h-auto w-full pb-5 md:w-[480px]">
      <div>
        <div className="p-2">
          <div className="flex items-center">
            <header className="flex flex-1 items-center space-x-2">
              <div role="button">
                <Avatar ignoreFallback size="sm" src={userProfile} />
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold">{username}</span>
                <div className="space-x-2 text-sm">
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">
                    {dayjs(createdAt?.toDate()).fromNow()}
                  </span>
                </div>
              </div>
            </header>
            <div>
              {true ? (
                <Menu isLazy closeOnSelect placement="bottom-end">
                  <MenuButton aria-label="Options">
                    <BsThreeDotsVertical className="cursor-pointer text-xl" />
                  </MenuButton>
                  <MenuList backgroundColor="#242526" border="none" padding="2">
                    <MenuItem
                      icon={<MdDeleteOutline className="text-lg" />}
                      onClick={() => handlePostDeletion(postId, imageRef)}
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: '#40404F',
                        borderRadius: '3px',
                      }}
                    >
                      <span className="text-gray-400">Delete Post</span>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </div>
          </div>
        </div>

        {postImage && (
          <div>
            <div style={{ position: 'relative', paddingTop }}>
              <Image
                alt=""
                src={postImage}
                layout="fill"
                objectFit="contain"
                onLoad={({ target }) => {
                  const { naturalWidth, naturalHeight } =
                    target as HTMLImageElement;
                  setPaddingTop(
                    `calc(100% / (${naturalWidth} / ${naturalHeight})`
                  );
                }}
              />
            </div>
          </div>
        )}

        <div className="px-2">
          <div className="flex text-2xl">
            <div className="flex flex-1 space-x-3 pt-3">
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
            <span className="text-sm font-medium md:text-xl">{likes}</span>
            <span className="ml-2">likes</span>
          </div>

          <p className="text-xl md:text-2xl">{postTitle}</p>
          <Collapse startingHeight={20} in={show}>
            <p className="text-sm">
              <span className="mr-2 font-semibold tracking-wide">
                {username}
              </span>
              <span>{description}</span>
            </p>
          </Collapse>
          {description.length > 30 && (
            <Text
              className="cursor-pointer text-sm font-bold text-gray-400"
              onClick={setShow.toggle}
            >
              Show {show ? 'Less' : 'More'}
            </Text>
          )}
        </div>
      </div>
    </article>
  );
};
export default Feed;
