import { BsSearch } from 'react-icons/bs';
import { useAuthUser } from '@react-query-firebase/auth';
import { Spinner } from '@chakra-ui/react';

import Brand from '../components/Brand';
import UserRecommendation from '../components/UserRecommendation';
import VirtualisedList from '../components/VirtualisedList';
import { Meta } from '../layouts/Meta';
import { Main } from '../templates/Main';
import { auth } from '../../firebase';

export default function Home() {
  const user = useAuthUser(['user'], auth, {
    onSuccess(user) {
      if (user) {
        console.log('User is authenticated!', user);
      }
    },
    onError(error) {
      console.error('Failed to subscribe to users authentication state!', error);
    },
  });

  if (user.isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-600 flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  }

  console.log('user fetched', user);

  return (
    <Main
      meta={
        <Meta
          title="FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="h-screen">
        <div className="">
          <header className="block md:hidden text-center">
            <Brand />
          </header>
          <div className="px-5">
            <div className="flex w-full md:hidden py-4 px-2 my-5 items-center bg-gray-800 rounded-md">
              <BsSearch className="text-xl text-slate-300 mx-3" />
              <input
                className="w-full bg-transparent outline-none border-none"
                type="text"
                placeholder="Search User..."
              />
            </div>
          </div>
          <div className="flex md:p-10 justify-center items-start gap-10">
            <main className="space-y-5 pb-16 md:ml-[20%] xl:ml-[10%]">
              <VirtualisedList />
            </main>
            <aside className="hidden lg:flex flex-col">
              <UserRecommendation />
            </aside>
          </div>
        </div>
      </div>
    </Main>
  );
}
