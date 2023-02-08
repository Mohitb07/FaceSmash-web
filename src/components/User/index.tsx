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
  fontSize = 'medium',
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
        className="mt-5 flex cursor-pointer items-center gap-5"
      >
        <Avatar size={size} src={profileURL} name={username} />
        <div>
          <Text aria-label="email" fontWeight="bold">
            {email}
          </Text>
          <Text aria-label="username" color="gray.500" fontSize={fontSize}>
            {username}
          </Text>
        </div>
      </div>
    </Link>
  );
};
export default User;
