import { Avatar, Skeleton } from '@chakra-ui/react';
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
    <div className="p-3">
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
        <UserConnections userId={userId} userQuery={userQuery} />
      </div>
      <div className="hidden items-center font-normal md:flex">
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
        <div className="ml-10 space-y-5">
          <div className="flex items-center space-x-5">
            <p className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl">
              {user.qusername}
            </p>
            <ProfileButton userId={userId} />
            {userId === authUser?.uid && <Settings />}
          </div>
          <UserConnections userId={userId} userQuery={userQuery} />
          <div>
            <span className="text-base">{user.bio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDetail;
