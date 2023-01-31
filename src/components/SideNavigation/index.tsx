import {
  Avatar,
  Drawer,
  DrawerContent,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  Spinner,
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { lazy, Suspense, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TiHome } from 'react-icons/ti';
import { VscHome } from 'react-icons/vsc';

import Brand from '../../components/Brand';
import NavItem from '../../components/NavItem';
import { useAuthUser } from '../../hooks/useAuthUser';

const PostModal = lazy(() => import('./PostModal'));
const SearchDrawer = lazy(() => import('./SearchDrawer'));

const Sidebar = () => {
  const router = useRouter();
  const auth = getAuth();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authUser } = useAuthUser();

  const searchDrawerClose = () => {
    if (isSearchDrawerOpen) {
      setIsSearchDrawerOpen(false);
    }
  };

  const modalClose = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const mutation = () => {
    signOut(auth)
      .then(() => {
        console.log('user logged out');
        router.replace('/auth/login');
      })
      .catch((error) => {
        console.log('error while signing out', error);
      });
  };

  return (
    <div className="fixed hidden h-full flex-col justify-between bg-[#0b0b0b] px-[2rem] pt-[5rem] pb-[2rem] md:flex">
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
                  <TiHome className="hover-animation text-3xl" />
                ) : (
                  <VscHome className="hover-animation text-3xl" />
                )
              }
              label="Home"
            />
          </Link>
          <NavItem
            onClick={() => setIsSearchDrawerOpen(true)}
            icon={<BsSearch className="hover-animation text-2xl" />}
            label="Search"
          />
          <NavItem
            onClick={() => setIsModalOpen(true)}
            icon={<HiOutlinePlusCircle className="hover-animation text-2xl" />}
            label="Create"
          />
          <Link href={`${authUser?.qusername}?user_id=${authUser?.uid}`}>
            <NavItem label="Profile">
              <Avatar
                ring={router.pathname === '/[username]' ? 2 : 0}
                ringColor="white"
                className="hover-animation"
                size="xs"
                name="Mohit Bisht"
                src={authUser?.profilePic}
              />
            </NavItem>
          </Link>
        </ul>
      </nav>
      <div>
        <Menu>
          <MenuButton>
            <ul>
              <li className="nav-item">
                <RxHamburgerMenu className="hover-animation text-3xl" />{' '}
                <span className="hidden lg:block">More</span>
              </li>
            </ul>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => mutation()}>
              <span className="text-red-500">Log Out</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <Suspense
        fallback={
          <Drawer isOpen={true} onClose={() => {}}>
            <DrawerContent>
              <Spinner />
            </DrawerContent>
          </Drawer>
        }
      >
        {isSearchDrawerOpen && (
          <SearchDrawer
            isSearchDrawerOpen={isSearchDrawerOpen}
            searchDrawerClose={searchDrawerClose}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <Modal isOpen={true} onClose={() => {}}>
            <ModalBody>
              <Spinner />
            </ModalBody>
          </Modal>
        }
      >
        {isModalOpen && (
          <PostModal isModalOpen={isModalOpen} modalClose={modalClose} />
        )}
      </Suspense>
    </div>
  );
};
export default Sidebar;
