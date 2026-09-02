import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { TbSquareRoundedPlus } from 'react-icons/tb';

import type { User } from '@/interface';
import { checkIsAdmin } from '@/utils/isAdmin';

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
  const isHomeActive = router.pathname === '/';
  const isAdminActive = router.pathname === '/admin';
  const isProfileActive =
    router.pathname === '/[username]' && router.query.userId === user?.uid;
  const isAdmin = checkIsAdmin(user);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-zinc-800/80 bg-[#0C1014]/90 backdrop-blur-lg">
      <ul
        className={`grid h-14 w-full place-items-center px-2 sm:px-4 ${
          isAdmin ? 'grid-cols-5' : 'grid-cols-4'
        }`}
      >
        <li>
          <Link href="/">
            <button
              aria-label="Home"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 ${
                isHomeActive
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isHomeActive ? (
                <GoHomeFill className="text-2xl" />
              ) : (
                <GoHome className="text-2xl" />
              )}
            </button>
          </Link>
        </li>
        <li>
          <button
            aria-label="Search"
            onClick={() => setIsSearchDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-all hover:text-white active:scale-95"
          >
            <IoSearch className="text-2xl" />
          </button>
        </li>
        <li>
          <button
            aria-label="Create Post"
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-all hover:text-white active:scale-95"
          >
            <TbSquareRoundedPlus className="text-2xl" />
          </button>
        </li>
        {isAdmin && (
          <li>
            <Link href="/admin">
              <button
                aria-label="Admin"
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 ${
                  isAdminActive
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MdOutlineAdminPanelSettings className="text-2xl" />
              </button>
            </Link>
          </li>
        )}
        <li>
          <Link
            href={{
              pathname: '/[username]',
              query: { username: user?.qusername, userId: user?.uid },
            }}
          >
            <button
              aria-label="Profile"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 ${
                isProfileActive
                  ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0C1014]'
                  : ''
              }`}
            >
              <Avatar
                size="xs"
                name={user?.username}
                src={user?.profilePic}
                className="transition-transform duration-200 hover:scale-105"
              />
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default memo(BottomNavigation);
