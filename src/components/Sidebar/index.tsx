import React, { useState } from 'react';

import { TiHome } from 'react-icons/ti';
import { BsSearch } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import Link from 'next/link';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

import Avatar from '../Avatar';
import Brand from '../Brand';

import NavItem from '../NavItem';
import PostModal from './PostModal';
import SearchDrawer from './SearchDrawer';

const Sidebar = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="hidden md:flex fixed h-full flex-col justify-between bg-[#0b0b0b] pt-[5rem] px-[2rem] pb-[2rem]">
      <nav>
        <div className="hidden lg:block">
          <Brand styles="mb-[3rem] ml-[1rem]" />
        </div>

        <div className="block lg:hidden">
          <h1 className="text-6xl text-center font-bold text-white mb-[3rem]">
            <span className="text-primary-100">F</span>
          </h1>
        </div>

        <ul className="space-y-12 text-xl">
          {/* VscHome */}
          <Link href="/">
            <NavItem
              icon={<TiHome className="text-3xl hover-animation" />}
              label="Home"
            />
          </Link>
          <NavItem
            onClick={() => setIsSearchDrawerOpen(true)}
            icon={<BsSearch className="text-2xl hover-animation" />}
            label="Search"
          />
          <NavItem
            onClick={() => setIsModalOpen(true)}
            icon={<HiOutlinePlusCircle className="text-2xl hover-animation" />}
            label="Create"
          />
          <Link href="/mohitbisht1903">
            <NavItem label="Profile">
              <Avatar
                styles="hover-animation"
                url={
                  'https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo'
                }
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
                <RxHamburgerMenu className="text-3xl hover-animation" />{' '}
                <span className="hidden lg:block">More</span>
              </li>
            </ul>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <span className="text-red-500">Log Out</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <SearchDrawer
        isSearchDrawerOpen={isSearchDrawerOpen}
        searchDrawerClose={searchDrawerClose}
      />
      <PostModal isModalOpen={isModalOpen} modalClose={modalClose} />
    </div>
  );
};
export default Sidebar;
