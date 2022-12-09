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
      <div className="flex flex-col justify-start md:justify-center space-y-10 items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className='flex items-center gap-5 lg:gap-10 xl:gap-20 p-3'>
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
                style="hidden md:block bg-white text-black text-base lg:text-md xl:text-[1.2rem] px-4"
              />
              <FiSettings className="text-xl xl:text-3xl" />
            </div>
            <Button
              label="Edit profile"
              onClick={() => {}}
              style="block md:hidden bg-white text-black text-base lg:text-md xl:text-[1.2rem] px-4"
            />
            <div className="text-lg hidden items-center gap-5 md:flex">
              <p>
                <span className="font-semibold">0</span> followings
              </p>
              <p>
                <span className="font-semibold">0</span> posts
              </p>
              <p>
                <span className="font-semibold">0</span> followers
              </p>
            </div>
            <div className="hidden md:flex">
              <span className="text-xl">www.mohitsbisht.tech</span>
            </div>
          </div>
        </div>
        <div className='space-y-5'>
          <Feed />
          <Feed />
          <Feed />
          <Feed />
        </div>
      </div>
    </Main>
  );
};
export default UserProfile;
