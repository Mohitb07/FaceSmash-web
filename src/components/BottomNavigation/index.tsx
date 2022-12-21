import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { TiHome } from 'react-icons/ti';
import { VscHome } from 'react-icons/vsc';
import PostModal from '../Sidebar/PostModal';

const BottomNavigation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const modalClose = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-4 p-2 place-items-center md:hidden h-14 w-full">
      <div>
        <Link href="/">
          {router.pathname === '/' ? (
            <TiHome className="text-2xl" />
          ) : (
            <VscHome className="text-2xl" />
          )}
        </Link>
      </div>
      <div>
        <BsSearch className="text-xl" />
      </div>
      <div>
        <HiOutlinePlusCircle onClick={() => setIsModalOpen(true)} className="text-2xl" />
        <PostModal isModalOpen={isModalOpen} modalClose={modalClose}/>
      </div>
      <div>
        <Link href="/mohitbisht1903">
          <Avatar
            ring={router.pathname === '/[username]' ? 2 : 0}
            ringColor="white"
            className="hover-animation"
            size="xs"
            name="Mohit Bisht"
            src="https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo"
          />
        </Link>
      </div>
    </div>
  );
};
export default BottomNavigation;
