import React from 'react';

import Link from 'next/link';
import {Avatar, Text,TypographyProps} from '@chakra-ui/react'

type UserProps = {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | "full"
  fontSize?: TypographyProps['fontSize']
  profileURL: string;
  username: string;
  email: string;
  userId: string;
};

const User = ({ size = 'md',fontSize="medium", profileURL, username, email, userId }: UserProps) => {
  return (
    <Link href={`${username}?user_id=${userId}`}>
      <div className="flex items-center gap-5 mt-5 cursor-pointer">
        <Avatar size={size} src={profileURL} name={username}/>
        <div>
          <Text aria-label='email' fontWeight="bold">{email}</Text>
          <Text aria-label='username' color="gray.500" fontSize={fontSize}>{username}</Text>
        </div>
      </div>
    </Link>
  );
};
export default User;
