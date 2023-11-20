import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

import Brand from '@/components/Brand';
import NavItem from '@/components/NavItem';
import type { User } from '@/interface';

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
    <div className="flex h-full flex-col justify-between p-6 lg:w-full lg:items-center">
      <nav>
        <div className="hidden lg:block">
          <Brand styles="mb-[3rem] ml-[1rem]" />
        </div>
        <div className="block lg:hidden">
          <h1 className="mb-[3rem] text-center text-4xl font-bold">
            <span className="text-primary-100">F</span>
          </h1>
        </div>

        <ul className="space-y-10 text-xl">
          <Link href="/">
            <NavItem
              icon={
                router.pathname === '/' ? (
                  // <TiHome className="hover-animation text-4xl text-blue-500" />
                  <img
                    width="40"
                    height="40"
                    src="https://img.icons8.com/3d-fluency/94/paper-plane.png"
                    alt="paper-plane"
                  />
                ) : (
                  // <VscHome className="hover-animation text-4xl" />
                  <img
                    width="40"
                    height="40"
                    src="https://img.icons8.com/3d-fluency/94/paper-plane.png"
                    alt="paper-plane"
                  />
                )
              }
              label="Home"
            />
          </Link>
          <NavItem
            onClick={() => setIsSearchDrawerOpen(true)}
            icon={
              <img
                width="40"
                height=""
                src="https://img.icons8.com/pastel-glyph/64/7950F2/search--v2.png"
                alt="search--v2"
              />
            }
            label="Search"
          />
          <NavItem
            onClick={() => setIsModalOpen(true)}
            icon={
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/glyph-neue/64/7950F2/plus-2-math.png"
                alt="plus-2-math"
              />
            }
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
                className="hover-animation"
                size="sm"
                name={user?.username}
                src={user?.profilePic}
              />
            </NavItem>
          </Link>
        </ul>
      </nav>
      <div>
        <div className="hidden lg:block">
          <Settings Icon={RxHamburgerMenu} label="More" />
        </div>
        <div className="lg:hidden">
          <Settings Icon={RxHamburgerMenu} />
        </div>
      </div>
    </div>
  );
};
export default memo(Sidebar);
