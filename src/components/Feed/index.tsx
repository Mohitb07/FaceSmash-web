import React, { useState } from 'react';

import Image from 'next/image';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbMessageCircle2 } from 'react-icons/tb';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { MdDeleteOutline } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Collapse, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { FeedProps } from '../../interface';
import Link from 'next/link';
import { useHandlePost } from '../../hooks/useHandlePost';

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
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const { deletePostWithoutImage, deletePostWithImage } = useHandlePost();

  const handlePostDeletion = async (postId: string, imageRef?: string) => {
    if (authUserId !== userId) return;
    if (postImage && imageRef) {
      await deletePostWithImage(postId, `${authUserId}/posts/${imageRef}`);
    } else {
      await deletePostWithoutImage(postId);
    }
  };

  return (
    <div className="md:w-[500px] lg:w-[450px] xl:w-[600px] bg-[#242526] rounded-md">
      <header className="flex items-center justify-between p-3 h-[4rem] md:h-[5rem]">
        <Link href={`${username}?user_id=${userId}`}>
          <div className="flex items-center space-x-3 cursor-pointer">
            <Avatar size="sm" name="Mohit Bisht" src={userProfile || ''} />
            <p className="font-bold">{username}</p>
          </div>
        </Link>
        {authUserId === userId ? (
          <Menu isLazy>
            <MenuButton>
              <BsThreeDotsVertical className="text-xl cursor-pointer" />
            </MenuButton>
            <MenuList backgroundColor="#242526" border="none" padding="2">
              <MenuItem
                icon={<MdDeleteOutline className="text-lg" />}
                onClick={() => handlePostDeletion(postId, imageRef)}
                backgroundColor="transparent"
                _hover={{ backgroundColor: '#40404F', borderRadius: '3px' }}
              >
                <span className="text-gray-400">Delete Post</span>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </header>
      {postImage && (
        <Image
          className="w-full h-full"
          src={postImage}
          objectFit="cover"
          height={600}
          width={600}
          alt="post image"
          blurDataURL={postImage}
        />
      )}
      <div className="p-4 space-y-3 md:space-y-5">
        <div
          className={`flex flex-col ${!postImage ? 'flex-col-reverse' : ''}`}
        >
          <div>
            <div className="flex space-y-3 md:space-y-5 justify-between items-center text-2xl md:text-3xl">
              <div className="flex items-center space-x-2 md:space-x-5">
                <div className="group cursor-pointer">
                  {hasLiked ? (
                    <FaHeart className="text-red-500 group-hover:opacity-40 group-hover:scale-50 transition-transform ease-in-out duration-200" />
                  ) : (
                    <FiHeart className="group-hover:opacity-40 group-hover:scale-50 transition-transform ease-in-out duration-200" />
                  )}
                </div>
                <div className="group cursor-pointer">
                  <TbMessageCircle2 className="-scale-x-100 group-hover:opacity-40" />
                </div>
                <div className="group cursor-pointer">
                  <HiOutlinePaperAirplane className="rotate-90 group-hover:opacity-40" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <FiBookmark className="group-hover:opacity-40" />
              </div>
            </div>
            <div>
              <span className="text-base md:text-xl font-semibold">
                {likes} likes
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Text fontSize="3xl">{postTitle}</Text>
            <Collapse startingHeight={25} in={show}>
              <p className="text-base md:text-base">
                <span className="mr-2 font-semibold tracking-wide">
                  {username}
                </span>
                <span>{description}</span>
              </p>
            </Collapse>
            {description.length > 30 && (
              <Text
                className="cursor-pointer font-bold text-gray-400"
                mt={2}
                onClick={handleToggle}
              >
                Show {show ? 'Less' : 'More'}
              </Text>
            )}
          </div>
        </div>
        <div>
          <span className="text-slate-400 text-sm md:text-base">
            {dayjs(createdAt?.toDate()).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Feed;
