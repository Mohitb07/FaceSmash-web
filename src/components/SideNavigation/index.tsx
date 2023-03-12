import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { TiHome } from 'react-icons/ti';
import { VscHome } from 'react-icons/vsc';

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
    <div className="flex h-full flex-col justify-between bg-[#0b0b0b] px-[2rem] pt-[5rem] pb-[2rem]">
      <nav>
        <div className="hidden lg:block">
          <Brand styles="mb-[3rem] ml-[1rem]" />
        </div>
        <div className="block lg:hidden">
          <h1 className="mb-[3rem] text-center text-6xl font-bold text-white">
            <span className="text-primary-100">F</span>
          </h1>
        </div>

        <ul className="space-y-12 text-xl">
          <Link href="/">
            <NavItem
              icon={
                router.pathname === '/' ? (
                  <TiHome className="hover-animation text-4xl" />
                ) : (
                  <VscHome className="hover-animation text-4xl" />
                )
              }
              label="Home"
            />
          </Link>
          <NavItem
            onClick={() => setIsSearchDrawerOpen(true)}
            icon={<BsSearch className="hover-animation text-3xl" />}
            label="Search"
          />
          <NavItem
            onClick={() => setIsModalOpen(true)}
            icon={<HiOutlinePlusCircle className="hover-animation text-3xl" />}
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
        <Settings />
      </div>
    </div>
  );
};
export default memo(Sidebar);
