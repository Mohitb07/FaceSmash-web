import { lazy, Suspense, useContext } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useDisclosure } from '@chakra-ui/react';

import Button from '../../components/Button';
import VirtualisedList from '../../components/VirtualisedList';
import { Meta } from '../../layouts/Meta';
import { Main } from '../../templates/Main';
import Avatar from '../../components/Avatar';
import { useAuthUser } from '../../hooks/useAuthUser';

const UpdateProfileModal = lazy(
  () => import('../../components/UpdateProfileModal')
);

// bg-blue-500 md:bg-red-500 lg:bg-green-500 xl:bg-pink-500

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authuser = useAuthUser();
  return (
    <Main
      meta={
        <Meta
          title="Mohit Bisht (@mohitbisht1903) - FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="flex flex-col justify-start md:justify-center space-y-3 md:space-y-10 items-center md:p-10 lg:ml-[10%] xl:ml-0">
        <div className="flex items-center gap-5 lg:gap-10 xl:gap-20 p-3">
          <div>
            <Avatar
              height={200}
              width={200}
              url={
                authuser?.profilePic ||
                'data:image/jpeg;base64,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'
              }
            />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-5">
              <p className="text-3xl md:text-xl lg:text-3xl xl:text-4xl font-light">
                {authuser?.qusername}
              </p>
              <Button
                label="Edit profile"
                onClick={onOpen}
                style="hidden md:block text-base lg:text-md xl:text-[1.1rem] px-4 bg-[#fff] text-black"
              />
              <FiSettings className="text-xl xl:text-3xl" />
            </div>
            <Button
              label="Edit profile"
              onClick={onOpen}
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
              <span className="text-xl">{authuser?.bio}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:hidden text-left w-full px-5">
          <span className="text-lg font-semibold">Mohit Bisht</span>
          <span className="text-base">{authuser?.bio}</span>
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
          <VirtualisedList />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isOpen && <UpdateProfileModal onClose={onClose} isOpen={isOpen} />}
      </Suspense>
    </Main>
  );
};
export default UserProfile;
