import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { TbSquareRoundedPlus } from 'react-icons/tb';

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
            {router.pathname === '/' ? (
              <GoHomeFill className="text-2xl" />
            ) : (
              <GoHome className="text-2xl" />
            )}
          </Link>
        </li>
        <li>
          <IoSearch
            onClick={() => setIsSearchDrawerOpen(true)}
            className="text-2xl"
          />
        </li>
        <li>
          {/* <img
            onClick={() => setIsModalOpen(true)}
            width="24"
            height="24"
            src="https://img.icons8.com/glyph-neue/64/7950F2/plus-2-math.png"
            alt="plus-2-math"
          /> */}
          <TbSquareRoundedPlus
            onClick={() => setIsModalOpen(true)}
            className="text-2xl"
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
