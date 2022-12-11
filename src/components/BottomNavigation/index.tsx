import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { TiHome } from 'react-icons/ti';
import Avatar from '../Avatar';

type BottomNavigationProps = {
    
};

const BottomNavigation:React.FC<BottomNavigationProps> = () => {
    return (
        <div className='grid grid-cols-4 p-2 place-items-center md:hidden h-14 w-full'>
            <div>
                <TiHome className="text-2xl" />
            </div>
            <div>
                <BsSearch className="text-xl" />
            </div>
            <div>
                <HiOutlinePlusCircle className='text-2xl'/>
            </div>
            <div>
            <Avatar
              url={
                'https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo'
              }
            />
            </div>
        </div>
    )
}
export default BottomNavigation;