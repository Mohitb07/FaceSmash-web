import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiAt, BiLinkExternal, BiMessageRounded } from 'react-icons/bi';
import { BsImage, BsThreeDots } from 'react-icons/bs';
import { CiTrash } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { FiAlertTriangle, FiHeart, FiSend } from 'react-icons/fi';
import { LiaEdit } from 'react-icons/lia';
import { MdVerified } from 'react-icons/md';

import { useAuthUser } from '@/hooks/useAuthUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { FeedProps } from '@/interface';

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
  handleLikes,
  setPostEditModal,
  setInitialPostValues,
  setPostId,
  setImageRef,
}: FeedProps) => {
  const { authUser } = useAuthUser();
  const toast = useToast();
  const { deletePostWithImage, deletePostWithoutImage } = useHandlePost();

  const editHandler = () => {
    if (imageRef) setImageRef(imageRef);
    setPostId(postId);
    setInitialPostValues({
      title: postTitle,
      description,
      link,
      image: postImage,
    });
    setPostEditModal(true);
  };

  const {
    isOpen: isConfirmOpen,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeletePost = async () => {
    if (authUser?.uid !== userId) return;
    try {
      setIsDeleting(true);
      if (postImage && imageRef) {
        await deletePostWithImage(postId, `${authUser?.uid}/posts/${imageRef}`);
      } else {
        await deletePostWithoutImage(postId);
      }
      toast({
        title: 'Post deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
      onCloseConfirm();
    } catch (err: any) {
      console.error('Delete post error', err);
      toast({
        title: 'Failed to delete post',
        description: err?.message || 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/${encodeURIComponent(
      username
    )}?userId=${userId}`;
    navigator.clipboard.writeText(postUrl);
    toast({
      title: 'Link copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const userHandle = `@${
    username?.toLowerCase().replace(/\s+/g, '') || 'user'
  }`;

  return (
    <article className="group relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-3.5 shadow-2xl transition-all duration-300 hover:border-zinc-700/60 sm:rounded-[28px] sm:p-5">
      {/* Header Row: Avatar, Info Stack, Options */}
      <header className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={{
              pathname: '/[username]',
              query: { username, userId },
            }}
          >
            <div className="relative cursor-pointer transition-transform duration-200 hover:scale-105">
              <Avatar
                name={username}
                size="md"
                src={userProfile}
                className="h-10 w-10 rounded-full ring-2 ring-purple-500/20 sm:h-12 sm:w-12"
              />
            </div>
          </Link>
          <div className="flex flex-col">
            {/* Top row: Handle + Verified */}
            <div className="flex items-center space-x-1.5">
              <Link
                href={{
                  pathname: '/[username]',
                  query: { username, userId },
                }}
              >
                <span className="cursor-pointer text-sm font-semibold tracking-tight text-zinc-300 transition-colors hover:text-white">
                  {userHandle}
                </span>
              </Link>
              <MdVerified className="text-base text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]" />
            </div>

            {/* Bottom row: Name + yellow bullet + yellow timestamp */}
            <div className="flex items-center space-x-2 text-xs md:text-sm">
              <span className="font-bold text-zinc-100">{username}</span>
              <span className="font-bold text-yellow-400">•</span>
              <span className="font-medium text-yellow-400">
                {dayjs(createdAt?.toDate()).fromNow()}
              </span>
            </div>
          </div>
        </div>

        {/* Options Menu (Three dots) */}
        {authUserId === userId && (
          <Menu isLazy placement="bottom-end">
            <MenuButton
              aria-label="Options"
              className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <BsThreeDots className="text-lg" />
            </MenuButton>
            <MenuList
              backgroundColor="#16181c"
              borderColor="#27272a"
              borderRadius="2xl"
              shadow="2xl"
              padding="1.5"
              zIndex="50"
            >
              <MenuItem
                icon={<LiaEdit className="text-lg text-purple-400" />}
                onClick={editHandler}
                backgroundColor="transparent"
                color="white"
                _hover={{
                  backgroundColor: '#27272a',
                  borderRadius: 'xl',
                  color: 'white',
                }}
                _focus={{
                  backgroundColor: '#27272a',
                  color: 'white',
                }}
                className="text-sm font-semibold text-white"
              >
                Edit Post
              </MenuItem>
              <MenuItem
                icon={<CiTrash className="text-lg text-red-400" />}
                onClick={onOpenConfirm}
                backgroundColor="transparent"
                color="red.400"
                _hover={{
                  backgroundColor: '#27272a',
                  borderRadius: 'xl',
                  color: 'red.300',
                }}
                _focus={{
                  backgroundColor: '#27272a',
                  color: 'red.300',
                }}
                className="text-sm font-semibold text-red-400"
              >
                Delete Post
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </header>

      {/* Post Text / Description */}
      {(description || postTitle) && (
        <div className="my-2 md:my-3">
          <p className="text-sm leading-relaxed text-zinc-200 md:text-[15px]">
            {description || postTitle}
          </p>
        </div>
      )}

      {/* Post Image */}
      {postImage && (
        <FeedImage
          postImage={postImage}
          link={link}
          alt={postTitle || 'Post image'}
        />
      )}

      {/* Standalone Link Preview (when there is a link but no image) */}
      {link && !postImage && (
        <div className="my-2 md:my-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-zinc-700/60 bg-[#0c1014]/60 p-3 transition-all duration-200 hover:border-purple-500/50 hover:bg-zinc-800/60 sm:p-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 sm:h-10 sm:w-10">
              <BiLinkExternal className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-purple-400">
                {link}
              </p>
              <p className="text-xs text-zinc-400">
                Click to visit external link
              </p>
            </div>
          </a>
        </div>
      )}

      {/* Actions Bar: Like, Comment, Send */}
      <footer className="mt-2.5 flex items-center justify-between sm:mt-4">
        <div className="flex items-center space-x-4 text-zinc-400">
          {/* Like button */}
          <button
            onClick={() => handleLikes(postId)}
            aria-label="like or unlike post"
            className="flex items-center gap-1.5 transition-transform duration-200 active:scale-90"
          >
            {hasLiked ? (
              <FaHeart className="text-xl text-red-500" />
            ) : (
              <FiHeart className="text-xl transition-colors hover:text-red-400" />
            )}
            {likes > 0 && (
              <span
                className={`text-xs font-semibold ${
                  hasLiked ? 'text-red-400' : 'text-zinc-400'
                }`}
              >
                {likes}
              </span>
            )}
          </button>

          {/* Comment icon */}
          <button
            aria-label="Comment"
            className="transition-colors hover:text-white"
          >
            <BiMessageRounded className="text-xl" />
          </button>

          {/* Send / Share icon */}
          <button
            onClick={handleShare}
            aria-label="Share post link"
            className="transition-colors hover:text-white"
          >
            <FiSend className="text-lg" />
          </button>
        </div>
      </footer>

      {/* Bottom Comment Input Bar */}
      <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-[#0c1014]/70 px-3 py-1.5 sm:mt-4 sm:gap-3 sm:px-3.5 sm:py-2">
        <Avatar
          size="xs"
          name={authUser?.username || 'User'}
          src={authUser?.profilePic || ''}
          className="shrink-0"
        />
        <input
          type="text"
          placeholder="Write your comment"
          className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none md:text-sm"
        />
        <div className="flex items-center gap-2 text-zinc-500">
          <button
            type="button"
            aria-label="Mention"
            className="transition-colors hover:text-zinc-300"
          >
            <BiAt className="text-lg" />
          </button>
          <button
            type="button"
            aria-label="Attach media"
            className="transition-colors hover:text-zinc-300"
          >
            <BsImage className="text-base" />
          </button>
        </div>
      </div>

      {/* Delete Post Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={onCloseConfirm}
        isCentered
        size="md"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
        <ModalContent
          bg="#16181c"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="2xl"
          shadow="2xl"
          color="white"
          p={2}
        >
          <ModalHeader className="flex items-center gap-2.5 text-lg font-bold text-red-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FiAlertTriangle className="text-xl" />
            </div>
            <span>Delete Post?</span>
          </ModalHeader>
          <ModalCloseButton
            color="zinc.400"
            _hover={{ color: 'white', bg: 'zinc.800' }}
            rounded="full"
          />
          <ModalBody className="space-y-3 text-sm text-zinc-300">
            <p>
              Are you sure you want to delete{' '}
              <strong className="text-white">
                {postTitle ? `"${postTitle}"` : 'this post'}
              </strong>
              ?
            </p>
            <p className="text-xs text-zinc-400">
              This action cannot be undone. This post and its likes will be
              permanently removed from your profile and the home feed.
            </p>
          </ModalBody>
          <ModalFooter gap={3} pt={4}>
            <Button
              variant="ghost"
              colorScheme="gray"
              size="sm"
              onClick={onCloseConfirm}
              isDisabled={isDeleting}
              className="rounded-xl text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={confirmDeletePost}
              isLoading={isDeleting}
              loadingText="Deleting..."
              className="rounded-xl font-bold shadow-lg shadow-red-600/30"
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </article>
  );
};

export default Feed;
