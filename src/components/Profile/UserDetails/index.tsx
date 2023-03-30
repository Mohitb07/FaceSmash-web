import { Avatar, Skeleton, Text } from '@chakra-ui/react';
import type { DocumentData, Query } from 'firebase/firestore';
import React from 'react';

import Settings from '@/components/Settings';
import { useAuthUser } from '@/hooks/useAuthUser';
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
  isLoading,
  userQuery,
  user,
  userId,
}: UserDetailProps) => {
  const { authUser } = useAuthUser();
  return (
    <div className="p-3 md:min-w-[570px]">
      <div className="block md:hidden">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20">
          <div>
            <Skeleton borderRadius="full" isLoaded={!isLoading}>
              <Avatar
                loading="lazy"
                size="2xl"
                ignoreFallback
                name={user.username}
                src={user.profilePic}
                showBorder
              />
            </Skeleton>
          </div>
          <div>
            <Skeleton isLoaded={!isLoading}>
              <div>
                <div className="flex items-center">
                  <p className="text-3xl font-light md:text-2xl lg:text-3xl xl:text-4xl">
                    {user.qusername}
                  </p>
                  {userId === authUser?.uid && <Settings />}
                </div>
                <span className="text-base">{user.bio}</span>
              </div>
            </Skeleton>
          </div>
        </div>
        <div className="my-2">
          <ProfileButton userId={userId} />
        </div>
        <UserConnections isMobile userId={userId} userQuery={userQuery} />
      </div>
      <div className="hidden w-full items-center font-normal md:flex">
        <Skeleton borderRadius="full" isLoaded={!isLoading}>
          <Avatar
            loading="lazy"
            size="2xl"
            ignoreFallback
            name={user.username}
            src={user.profilePic}
            showBorder
          />
        </Skeleton>
        <div className="ml-10 flex-1 space-y-5">
          <Skeleton
            display="flex"
            alignItems="center"
            borderRadius="3xl"
            isLoaded={!isLoading}
          >
            <p className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl">
              {user.qusername}
            </p>
            <div className="mx-5">
              <ProfileButton userId={userId} />
            </div>
            {userId === authUser?.uid && <Settings />}
          </Skeleton>
          <UserConnections userId={userId} userQuery={userQuery} />
          <Text fontSize="medium">{user.bio}</Text>
        </div>
      </div>
    </div>
  );
};
export default UserDetail;
