import { Avatar } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { GoHome } from 'react-icons/go';
// @ts-ignore
import { GoHomeFill } from 'react-icons/go';
// @ts-ignore
import { IoSearch } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbSquareRoundedPlus } from 'react-icons/tb';

import Brand from '@/components/Brand';
import NavItem from '@/components/NavItem';
import type { User } from '@/interface';
import Logo from '@/public/android-chrome-192x192.png';

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
  return (
    <div className="h-screen pt-5">
      <div className="flex h-full flex-col">
        <div className="pb-14">
          <div className="hidden items-start lg:flex">
            <Brand />
          </div>
          <div className="block lg:hidden">
            <Image src={Logo} alt="logo" height={60} width={60} />
          </div>
        </div>

        {/* Ensure nav takes full available height */}
        <nav className="flex grow flex-col">
          <ul className="space-y-8">
            <Link href="/">
              <NavItem
                icon={
                  router.pathname === '/' ? (
                    <GoHomeFill className="text-4xl" />
                  ) : (
                    <GoHome className="text-4xl" />
                  )
                }
                label="Home"
              />
            </Link>
            <NavItem
              onClick={() => setIsSearchDrawerOpen(true)}
              icon={<IoSearch className="text-4xl" />}
              label="Search"
            />
            <NavItem
              onClick={() => setIsModalOpen(true)}
              icon={<TbSquareRoundedPlus className="text-4xl" />}
              label="Create"
            />
            <Link
              href={{
                pathname: '/[username]',
                query: { username: user?.qusername, userId: user?.uid },
              }}
            >
              <NavItem label="Profile">
                <Avatar
                  role="navigation"
                  ring={
                    router.pathname === '/[username]' &&
                    router.query.userId === user?.uid
                      ? 2
                      : 0
                  }
                  ringColor="white"
                  className="hover-animation ml-1"
                  size="sm"
                  name={user?.username}
                  src={user?.profilePic}
                />
              </NavItem>
            </Link>
          </ul>

          {/* Push this to the bottom */}
          <ul className="mt-auto text-xl">
            <div className="hidden lg:block">
              <Settings Icon={RxHamburgerMenu} label="More" />
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default memo(Sidebar);
