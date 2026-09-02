import { Avatar } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbSquareRoundedPlus } from 'react-icons/tb';

import Brand from '@/components/Brand';
import NavItem from '@/components/NavItem';
import type { User } from '@/interface';
import Logo from '@/public/android-chrome-192x192.png';
import { checkIsAdmin } from '@/utils/isAdmin';

import Settings from '../Settings';

type SidebarProps = {
  user: User | null;
  setIsSearchDrawerOpen: (value: boolean) => void;
  setIsModalOpen: (value: boolean) => void;
};

const Sidebar = ({
  user,
  setIsModalOpen,
  setIsSearchDrawerOpen,
}: SidebarProps) => {
  const router = useRouter();
  const isHomeActive = router.pathname === '/';
  const isAdminActive = router.pathname === '/admin';
  const isProfileActive =
    router.pathname === '/[username]' && router.query.userId === user?.uid;
  const isAdmin = checkIsAdmin(user);

  return (
    <div className="h-screen w-full px-2 pt-6 lg:px-4">
      <div className="flex h-full flex-col">
        <div className="pb-8 pl-2">
          <div className="hidden items-start lg:flex">
            <Brand />
          </div>
          <div className="block lg:hidden">
            <Image src={Logo} alt="logo" height={50} width={50} />
          </div>
        </div>

        {/* Ensure nav takes full available height */}
        <nav className="flex grow flex-col justify-between pb-6">
          <ul className="space-y-3">
            <Link href="/">
              <NavItem
                isActive={isHomeActive}
                icon={
                  isHomeActive ? (
                    <GoHomeFill className="text-3xl text-purple-400" />
                  ) : (
                    <GoHome className="text-3xl" />
                  )
                }
                label="Home"
              />
            </Link>
            <NavItem
              onClick={() => setIsSearchDrawerOpen(true)}
              icon={<IoSearch className="text-3xl" />}
              label="Search"
            />
            <NavItem
              onClick={() => setIsModalOpen(true)}
              icon={<TbSquareRoundedPlus className="text-3xl" />}
              label="Create"
            />
            {isAdmin && (
              <Link href="/admin">
                <NavItem
                  isActive={isAdminActive}
                  icon={
                    <MdOutlineAdminPanelSettings
                      className={`text-3xl ${
                        isAdminActive ? 'text-purple-400' : ''
                      }`}
                    />
                  }
                  label="Admin"
                />
              </Link>
            )}
            <Link
              href={{
                pathname: '/[username]',
                query: { username: user?.qusername, userId: user?.uid },
              }}
            >
              <NavItem isActive={isProfileActive} label="Profile">
                <Avatar
                  role="navigation"
                  ring={isProfileActive ? 2 : 0}
                  ringColor="purple.400"
                  className="hover-animation ml-0.5"
                  size="sm"
                  name={user?.username}
                  src={user?.profilePic}
                />
              </NavItem>
            </Link>
          </ul>

          {/* Bottom actions */}
          <div className="text-xl">
            <div className="hidden lg:block">
              <Settings Icon={RxHamburgerMenu} label="More" />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default memo(Sidebar);
