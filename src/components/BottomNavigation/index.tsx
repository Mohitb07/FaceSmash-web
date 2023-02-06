import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { TiHome } from 'react-icons/ti';
import { VscHome } from 'react-icons/vsc';

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
    <nav className="fixed bottom-0 z-50 w-full bg-slate-900">
      <ul className="grid h-14 w-full grid-cols-4 place-items-center p-2 md:hidden">
        <li>
          <Link href="/">
            {router.pathname === '/' ? (
              <TiHome className="text-2xl" />
            ) : (
              <VscHome className="text-2xl" />
            )}
          </Link>
        </li>
        <li>
          <BsSearch
            onClick={() => setIsSearchDrawerOpen(true)}
            className="text-xl"
          />
        </li>
        <li>
          <div>
            <HiOutlinePlusCircle
              onClick={() => setIsModalOpen(true)}
              className="text-2xl"
            />
          </div>
        </li>
        <li>
          <Link href={`${user?.qusername}?user_id=${user?.uid}`}>
            <Avatar
              ring={
                router.pathname === '/[username]' &&
                router.query.user_id === user?.uid
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
