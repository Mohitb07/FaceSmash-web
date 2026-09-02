import type { TypographyProps } from '@chakra-ui/react';
import { Avatar, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

type UserProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2xs' | 'xs' | 'full';
  fontSize?: TypographyProps['fontSize'];
  profileURL: string;
  username: string;
  email: string;
  userId: string;
  onClose?: () => void;
};

const User = ({
  size = 'md',
  profileURL,
  username,
  email,
  userId,
  onClose,
}: UserProps) => {
  return (
    <Link
      href={{
        pathname: '/[username]',
        query: { username, userId },
      }}
    >
      <div
        onClick={onClose}
        className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2 transition-all hover:bg-zinc-800/60"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            size={size}
            src={profileURL}
            name={username}
            className="ring-1 ring-zinc-700/60 transition-transform group-hover:scale-105"
          />
          <div className="min-w-0 flex-1">
            <Text
              aria-label="username"
              className="truncate text-sm font-bold text-zinc-100 transition-colors group-hover:text-purple-400"
            >
              {username}
            </Text>
            <Text aria-label="email" className="truncate text-xs text-zinc-400">
              {email}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default User;
