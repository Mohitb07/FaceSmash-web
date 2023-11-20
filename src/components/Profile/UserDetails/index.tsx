import { Skeleton, useMediaQuery } from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import React from 'react';
import Avatar from 'react-avatar';

import Settings from '@/components/Settings';
import type { User } from '@/interface';

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
  const [isMobile] = useMediaQuery('(max-width: 400px)');
  const [isMedium] = useMediaQuery('(max-width: 768px)');
  const [isLarge] = useMediaQuery('(max-width: 1024px)');

  const isSmaller = isMobile;
  const isMediumSize = isMedium;

  return (
    <div className="flex h-full flex-col justify-center overflow-hidden p-3 md:px-10">
      <div className="flex items-center justify-between pt-10 md:px-10 xl:px-20">
        <div>
          <Skeleton
            borderRadius="full"
            isLoaded={!isLoading}
            width="-webkit-fit-content"
          >
            <Avatar
              name={user.username}
              src={user.profilePic}
              round={true}
              size={
                isSmaller
                  ? '120'
                  : isMediumSize
                  ? '150'
                  : isLarge
                  ? '200'
                  : '230'
              }
              className="object-contain hover:opacity-80"
            />
          </Skeleton>
        </div>
        <div className="flex items-center">
          <ProfileButton userId={userId} />
          <Settings />
        </div>
      </div>
      <div className="flex-wrap space-y-3 md:px-10 xl:px-20">
        <Skeleton
          borderRadius="full"
          isLoaded={!isLoading}
          mt={5}
          width="-webkit-fit-content"
        >
          <p className="text-2xl font-semibold">{user.username}</p>
        </Skeleton>
        <Skeleton
          borderRadius="full"
          isLoaded={!isLoading}
          width="-webkit-fit-content"
        >
          <p className="text-lg md:text-xl">{user.bio}</p>
        </Skeleton>
        <Skeleton
          borderRadius="full"
          isLoaded={!isLoading}
          width="-webkit-fit-content"
        >
          <p className="text-base md:text-lg">{user.email}</p>
        </Skeleton>

        <Skeleton
          borderRadius="full"
          isLoaded={!isLoading}
          // width="-webkit-fit-content"
        >
          <UserConnections userId={userId} userQuery={userQuery} />
        </Skeleton>
      </div>
    </div>
  );
};
export default UserDetail;
