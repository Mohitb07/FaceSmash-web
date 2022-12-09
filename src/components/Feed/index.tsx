import Image from 'next/image';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbMessageCircle2 } from 'react-icons/tb';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

import Avatar from '../Avatar';

const Feed = () => {
  return (
    <div className="md:w-[500px] lg:w-[450px] xl:w-[600px] bg-[#242526] rounded-md">
      <header className="flex items-center justify-between p-3 h-[4rem] md:h-[5rem]">
        <div className="flex items-center space-x-3">
          <Avatar
            url={
              'https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo'
            }
            height={40}
            width={40}
          />
          <p className="font-bold">crictracker</p>
        </div>
        <BsThreeDotsVertical className="text-xl cursor-pointer" />
      </header>
      <div>
        <Image
          src="https://scontent-del1-2.cdninstagram.com/v/t39.30808-6/318505197_6460820477281952_1445292485902657423_n.jpg?stp=dst-jpg_e15&_nc_ht=scontent-del1-2.cdninstagram.com&_nc_cat=108&_nc_ohc=0d_uS19-Si8AX-OnBi4&edm=AJ9x6zYAAAAA&ccb=7-5&ig_cache_key=Mjk4NjQxNTAyMDQzMTMxNjM3OQ%3D%3D.2-ccb7-5&oh=00_AfDvrQq53UyRSzPeII19X_UuOku9hOMqNTjZIpSJ7cV_SQ&oe=6395922E&_nc_sid=cff2a4"
          width={600}
          height={600}
          alt="post image"
        />
      </div>
      <div className="p-4 space-y-5">
        <div className="flex justify-between  items-center text-2xl md:text-4xl">
          <div className="flex items-center space-x-2 md:space-x-5">
            <div className="group cursor-pointer">
              <FiHeart className="group-hover:opacity-40" />
            </div>
            <div className="group cursor-pointer">
              <TbMessageCircle2 className="-scale-x-100 group-hover:opacity-40" />
            </div>
            <div className="group cursor-pointer">
              <HiOutlinePaperAirplane className="rotate-90 group-hover:opacity-40" />
            </div>
          </div>
          <div className="group cursor-pointer">
            <FiBookmark className="group-hover:opacity-40" />
          </div>
        </div>
        <div>
          <span className="text-lg md:text-xl font-semibold">65,584 likes</span>
        </div>
        <div>
          <p className="text-base md:text-lg">
            <span className="font-semibold mr-2">crictracker</span>The man of
            big occasions for India - Shikhar Dhawan🏆
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-sm md:text-base">2 DAYS AGO</span>
        </div>
      </div>
    </div>
  );
};
export default Feed;
