import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';

import type { User } from '@/interface';

type BottomNavigationProps = {
  user: User | null;
  setIsSearchDrawerOpen: (value: boolean) => void;
  setIsModalOpen: (value: boolean) => void;
};

const BottomNavigation = ({
  user,
  setIsModalOpen,
  setIsSearchDrawerOpen,
}: BottomNavigationProps) => {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 z-50 w-full bg-black">
      <ul className="grid h-14 w-full grid-cols-4 place-items-center p-2">
        <li>
          <Link href="/">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/3d-fluency/94/paper-plane.png"
              alt="paper-plane"
            />
          </Link>
        </li>
        <li>
          <img
            onClick={() => setIsSearchDrawerOpen(true)}
            width="24"
            height="24"
            src="https://img.icons8.com/pastel-glyph/64/7950F2/search--v2.png"
            alt="search--v2"
          />
        </li>
        <li>
          <img
            onClick={() => setIsModalOpen(true)}
            width="24"
            height="24"
            src="https://img.icons8.com/glyph-neue/64/7950F2/plus-2-math.png"
            alt="plus-2-math"
          />
        </li>
        <li>
          <Link
            href={{
              pathname: '/[username]',
              query: { username: user?.qusername, userId: user?.uid },
            }}
          >
            <Avatar
              ring={
                router.pathname === '/[username]' &&
                router.query.userId === user?.uid
                  ? 2
                  : 0
              }
              ringColor="white"
              className="hover-animation"
              size="xs"
              name={user?.username}
              src={user?.profilePic}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default memo(BottomNavigation);
