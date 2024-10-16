import { Avatar } from '@chakra-ui/react';
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
    <div className="mt-5 w-full">
      <div className="flex h-full w-full flex-col items-center">
        <div className="h-5/6 p-2">
          <div>
            <div className="mb-3 hidden lg:block">
              <Brand />
            </div>
            <div className="block lg:hidden">
              <h1 className="mb-[3rem] text-center text-4xl font-bold">
                <span className="text-primary-100">F</span>
              </h1>
            </div>
          </div>
          <nav className="flex h-full flex-col justify-between">
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
            <ul className="text-xl">
              <div className="hidden lg:block">
                <Settings Icon={RxHamburgerMenu} />
              </div>
              {/* <div className="lg:hidden">
                <Settings Icon={RxHamburgerMenu} />
              </div> */}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default memo(Sidebar);
