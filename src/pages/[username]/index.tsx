import React from 'react';
import { FiSettings } from 'react-icons/fi';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Feed from '../../components/Feed';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';

// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500

const UserProfile = () => {
  return (
    <Main
      meta={
        <Meta
          title="Mohit Bisht (@mohitbisht1903) - FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="flex flex-col justify-start md:justify-center space-y-5 md:space-y-10 items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20 p-3">
          <div className="h-[100px] w-[100px] md:h-[180px] md:w-[180px] xl:h-[200px] xl:w-[200px]">
            <Avatar
              url={
                'http://projects.websetters.in/digg-seos/digg/wp-content/themes/twentytwenty-child-theme/img/demo-prof.jpg'
              }
              height={200}
              width={200}
            />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-5">
              <p className="text-3xl md:text-xl lg:text-3xl xl:text-4xl font-light">
                mohitbisht1903
              </p>
              <Button
                label="Edit profile"
                onClick={() => {}}
                style="hidden md:block text-base lg:text-md xl:text-[1.1rem] px-4 bg-[#fff] text-black"
              />
              <FiSettings className="text-xl xl:text-3xl" />
            </div>
            <Button
              label="Edit profile"
              onClick={() => {}}
              style="block md:hidden text-base lg:text-md xl:text-[1.2rem] px-4 bg-[#fff] text-black"
            />
            <div className="text-lg hidden items-center gap-5 md:flex">
              <p>
                <span className="font-semibold mr-2">0</span> posts
              </p>
              <p>
                <span className="font-semibold mr-2">0</span> followers
              </p>
              <p>
                <span className="font-semibold mr-2">0</span> followings
              </p>
            </div>
            <div className="hidden md:flex">
              <span className="text-xl">www.mohitsbisht.tech</span>
            </div>
          </div>
        </div>
        <div className="h-[5rem] grid grid-cols-3 border-y border-slate-700 place-items-center w-full p-1 md:hidden">
          <div className="text-center">
            <span className="font-semibold">1230</span>
            <p className="text-slate-400">posts</p>
          </div>
          <div className="text-center">
            <span className="font-semibold">120k</span>
            <p className="text-slate-400">followers</p>
          </div>
          <div className="text-center">
            <span className="font-semibold">100</span>
            <p className="text-slate-400">following</p>
          </div>
        </div>
        <div className="space-y-5 pb-16">
          <Feed />
          <Feed />
          <Feed />
          <Feed />
          <>
            <p className="text-center text-gray-500">End Of Result</p>
          </>
        </div>
      </div>
    </Main>
  );
};
export default UserProfile;
