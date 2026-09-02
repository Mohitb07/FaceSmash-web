import {
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
  Spinner,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import {
  doc,
  type DocumentData,
  type Query,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React, { useState } from 'react';
import Files from 'react-files';
import {
  FiCamera,
  FiChevronDown,
  FiGlobe,
  FiLogOut,
  FiSettings,
  FiShare2,
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { CustomFile, User } from '@/interface';

import { db } from '../../../../firebase';
import ProfileButton from '../ProfileButton';
import UserConnections from '../UserConnections';

type UserDetailProps = {
  isLoading: boolean;
  userQuery: Query<DocumentData>;
  user: User;
  userId: string;
};

const UserDetail = ({
  isLoading = true,
  userQuery,
  user,
  userId = '',
}: UserDetailProps) => {
  const { authUser, isVerified, logout } = useAuthUser();
  const isLoggedInUser = authUser?.uid === userId;
  const isUserVerified = isLoggedInUser
    ? isVerified
    : (user as any)?.isVerified;
  const [showBio, setShowBio] = useBoolean(false);
  const toast = useToast();

  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const { uploadImage } = useImageUpload();

  const handleShare = () => {
    const profileUrl =
      typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Profile link copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const handleCoverUpload = async (files: CustomFile[]) => {
    if (!files.length || !authUser) return;
    const file = files[0];
    try {
      setIsCoverUploading(true);
      const fileExtension = file.extension || 'jpg';
      const urlRef = `${
        authUser.uid
      }/coverPic/cover_${Date.now()}.${fileExtension}`;
      const downloadUrl = await uploadImage(urlRef, file);
      await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), {
        coverPic: downloadUrl,
      });
      toast({
        title: 'Cover image updated successfully',
        status: 'success',
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        duration: 3000,
      });
    } catch (err: any) {
      console.error('Failed to upload cover picture', err);
      toast({
        title: 'Failed to upload cover image',
        description: err?.message || 'Please try again.',
        status: 'error',
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        duration: 4000,
      });
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleCoverError = (error: any) => {
    toast({
      title: 'Invalid Image',
      description: error?.message || 'Please select a valid image file.',
      status: 'error',
      variant: 'left-accent',
      position: 'bottom-right',
      isClosable: true,
    });
  };

  const usernameHandle =
    user?.qusername || user?.username?.toLowerCase() || 'user';
  const bioText = user?.bio?.trim() || '';
  const websiteUrl = user?.website?.trim() || '';
  const coverPicUrl = user?.coverPic?.trim() || '';

  return (
    <div className="w-full text-zinc-100">
      {/* Top Banner with Header Actions */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-tr from-[#16063b] via-[#6d0f66] to-[#d92656] p-4 sm:h-52 sm:p-5">
        {/* User's custom cover photo if uploaded */}
        {coverPicUrl && (
          <img
            src={coverPicUrl}
            alt={`${user?.username || 'User'}'s cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Abstract Mesh / Dark vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:20px_20px]" />
        {coverPicUrl && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        )}

        {/* Top bar over banner: @username and actions */}
        <div className="relative z-10 flex items-center justify-between text-white">
          <Skeleton
            isLoaded={!isLoading}
            borderRadius="md"
            startColor="#24262b"
            endColor="#32343a"
            height={isLoading ? '20px' : 'auto'}
            width={isLoading ? '100px' : 'auto'}
          >
            <button className="flex items-center gap-1 text-base font-semibold tracking-tight transition-opacity hover:opacity-80">
              <span>@{usernameHandle}</span>
              <FiChevronDown className="text-sm opacity-80" />
            </button>
          </Skeleton>
          <div className="flex items-center gap-2.5">
            {/* Change Cover Photo Button (Owner only) */}
            {isLoggedInUser && (
              <Files
                onChange={handleCoverUpload}
                onError={handleCoverError}
                accepts={['image/*']}
                maxFileSize={20000000}
                minFileSize={0}
                clickable={!isCoverUploading}
              >
                <IconButton
                  aria-label="Change cover picture"
                  title="Change cover picture"
                  icon={
                    isCoverUploading ? (
                      <Spinner size="xs" color="white" />
                    ) : (
                      <FiCamera className="text-sm" />
                    )
                  }
                  isLoading={isCoverUploading}
                  isRound
                  size="sm"
                  w="32px"
                  h="32px"
                  minW="32px"
                  p={0}
                  bg="blackAlpha.400"
                  color="white"
                  backdropFilter="blur(8px)"
                  _hover={{
                    bg: 'blackAlpha.600',
                    transform: 'scale(1.05)',
                  }}
                  _active={{
                    bg: 'blackAlpha.600',
                  }}
                />
              </Files>
            )}

            <IconButton
              onClick={handleShare}
              aria-label="Share profile"
              icon={<FiShare2 className="text-sm" />}
              isRound
              size="sm"
              w="32px"
              h="32px"
              minW="32px"
              p={0}
              bg="blackAlpha.400"
              color="white"
              backdropFilter="blur(8px)"
              _hover={{
                bg: 'blackAlpha.600',
                transform: 'scale(1.05)',
              }}
              _active={{
                bg: 'blackAlpha.600',
              }}
            />
            {isLoggedInUser && (
              <div className="md:hidden">
                <Menu placement="bottom-end" isLazy>
                  <MenuButton
                    as={IconButton}
                    aria-label="Settings"
                    icon={<FiSettings className="text-sm" />}
                    isRound
                    size="sm"
                    w="32px"
                    h="32px"
                    minW="32px"
                    p={0}
                    bg="blackAlpha.400"
                    color="white"
                    backdropFilter="blur(8px)"
                    _hover={{
                      bg: 'blackAlpha.600',
                      transform: 'scale(1.05)',
                    }}
                    _active={{
                      bg: 'blackAlpha.600',
                    }}
                  />
                  <Portal>
                    <MenuList
                      backgroundColor="#16181c"
                      borderColor="whiteAlpha.100"
                      borderRadius="2xl"
                      shadow="2xl"
                      padding="2"
                      minW="180px"
                      zIndex={9999}
                    >
                      <Link href="/about">
                        <MenuItem
                          backgroundColor="transparent"
                          color="white"
                          _hover={{
                            backgroundColor: '#27272a',
                            borderRadius: 'xl',
                            color: 'white',
                          }}
                          className="cursor-pointer py-2.5 text-xs font-semibold"
                        >
                          About FaceSmash
                        </MenuItem>
                      </Link>
                      <Link href="/help">
                        <MenuItem
                          backgroundColor="transparent"
                          color="white"
                          _hover={{
                            backgroundColor: '#27272a',
                            borderRadius: 'xl',
                            color: 'white',
                          }}
                          className="cursor-pointer py-2.5 text-xs font-semibold"
                        >
                          Help & Support
                        </MenuItem>
                      </Link>
                      <Link href="/privacy">
                        <MenuItem
                          backgroundColor="transparent"
                          color="white"
                          _hover={{
                            backgroundColor: '#27272a',
                            borderRadius: 'xl',
                            color: 'white',
                          }}
                          className="cursor-pointer py-2.5 text-xs font-semibold"
                        >
                          Privacy Policy
                        </MenuItem>
                      </Link>
                      <Link href="/terms">
                        <MenuItem
                          backgroundColor="transparent"
                          color="white"
                          _hover={{
                            backgroundColor: '#27272a',
                            borderRadius: 'xl',
                            color: 'white',
                          }}
                          className="cursor-pointer py-2.5 text-xs font-semibold"
                        >
                          Terms & Conditions
                        </MenuItem>
                      </Link>
                      <div className="my-1.5 border-t border-zinc-800/80" />
                      <MenuItem
                        onClick={logout}
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
                        icon={<FiLogOut className="text-base text-red-400" />}
                        className="py-2.5 text-xs font-semibold"
                      >
                        <span>Log Out</span>
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Card Content */}
      <div className="relative z-10 -mt-7 rounded-t-[32px] border-t border-zinc-800/60 bg-[#0C1014] px-5 pt-3 pb-2 shadow-sm">
        {/* Avatar & Top Action Button Row */}
        <div className="flex items-end justify-between">
          <div className="relative -mt-14 sm:-mt-16">
            <Skeleton
              isLoaded={!isLoading}
              borderRadius="full"
              startColor="#24262b"
              endColor="#32343a"
            >
              <Avatar
                size="xl"
                name={user?.username || ''}
                src={user?.profilePic || ''}
                className="rounded-full shadow-2xl ring-2 ring-purple-500/30"
              />
            </Skeleton>
          </div>
          <div className="mb-1">
            {isLoading ? (
              <Skeleton
                height="36px"
                width="124px"
                borderRadius="full"
                startColor="#24262b"
                endColor="#32343a"
              />
            ) : (
              <ProfileButton userId={userId} />
            )}
          </div>
        </div>

        {/* Name with Verified Badge */}
        <div className="mt-3 flex items-center gap-2">
          <Skeleton
            isLoaded={!isLoading}
            width={isLoading ? '140px' : 'fit-content'}
            height={isLoading ? '28px' : 'auto'}
            borderRadius="md"
            startColor="#24262b"
            endColor="#32343a"
          >
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {user?.username}
            </h1>
          </Skeleton>
          {isUserVerified && !isLoading && (
            <MdVerified
              className="text-xl text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
              title="Verified Account"
            />
          )}
        </div>

        {/* Stats Row (Following, Followers, Posts) */}
        <div className="mt-2">
          <UserConnections userId={userId} userQuery={userQuery} />
        </div>

        {/* Bio - only shown if set or loading */}
        {(isLoading || bioText) && (
          <div className="mt-3 text-sm leading-relaxed text-zinc-300">
            <Skeleton
              isLoaded={!isLoading}
              borderRadius="md"
              startColor="#24262b"
              endColor="#32343a"
              height={isLoading ? '36px' : 'auto'}
              width={isLoading ? '85%' : 'auto'}
            >
              <p>
                {showBio
                  ? bioText
                  : `${bioText.slice(0, 130)}${
                      bioText.length > 130 ? '... ' : ''
                    }`}
                {bioText.length > 130 && (
                  <button
                    onClick={setShowBio.toggle}
                    className="font-bold text-white hover:underline"
                  >
                    {showBio ? ' Less' : ' More'}
                  </button>
                )}
              </p>
            </Skeleton>
          </div>
        )}

        {/* Website / Portfolio Link - only shown if set or loading */}
        {(isLoading || websiteUrl) && (
          <div className="mt-2.5 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <FiGlobe className="text-base text-zinc-400" />
            <Skeleton
              isLoaded={!isLoading}
              borderRadius="md"
              startColor="#24262b"
              endColor="#32343a"
              height={isLoading ? '16px' : 'auto'}
              width={isLoading ? '120px' : 'auto'}
            >
              <a
                href={
                  websiteUrl.startsWith('http://') ||
                  websiteUrl.startsWith('https://')
                    ? websiteUrl
                    : `https://${websiteUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 transition-colors hover:text-purple-300 hover:underline"
              >
                {websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            </Skeleton>
          </div>
        )}

        {/* Tab Navigation - Only Posts */}
        <div className="mt-5 flex items-center justify-center border-b border-zinc-800/80 text-sm font-semibold">
          <div className="border-b-2 border-purple-500 pb-2.5 font-bold text-purple-400">
            Posts
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
