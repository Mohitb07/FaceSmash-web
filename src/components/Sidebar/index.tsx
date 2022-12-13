import React from 'react';

import { TiHome } from 'react-icons/ti';
import { BsSearch } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';

import Avatar from '../Avatar';
import Brand from '../Brand';
import Link from 'next/link';

const Sidebar = () => {
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
            <li className="nav-item group">
              <TiHome className="text-3xl hover-animation" />{' '}
              <span className="hidden lg:block">Home</span>
            </li>
          </Link>
          <li className="nav-item group">
            <BsSearch className="text-2xl hover-animation" />{' '}
            <span className="hidden lg:block">Search</span>
          </li>
          <Link href="/mohitbisht1903">
            <li className="nav-item group">
              <Avatar
                styles='hover-animation'
                url={
                  'https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo'
                }
                
              />{' '}
              <span className="hidden lg:block">Profile</span>
            </li>
          </Link>
        </ul>
      </nav>
      <div className="group">
        <ul>
          <li className="nav-item">
            <RxHamburgerMenu className="text-3xl hover-animation" />{' '}
            <span className="hidden lg:block">More</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
