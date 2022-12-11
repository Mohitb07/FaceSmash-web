import { BsSearch } from 'react-icons/bs';
import Feed from '../components/Feed';
import User from '../components/User';
import { Meta } from '../layouts/Meta';
import { Main } from '../templates/Main';

export default function Home() {
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
          <div className="block md:hidden text-center">
            <h1 className="text-[2rem] font-bold text-white">
              <span className="text-primary-100">Face</span>Smash
            </h1>
          </div>
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
              <Feed />
              <Feed />
              <Feed />
              <Feed />
              <>
                <p className='text-center text-gray-500'>End Of Result</p>
              </>
            </main>
            <aside className="hidden lg:flex flex-col">
              <div className="flex  items-center gap-5 mt-10">
                <User size="large" />
              </div>
              <div className="mt-5">
                <p className="text-xl text-gray-500 font-semibold">
                  Suggestions for you
                </p>
                <div>
                  <User />
                  <User />
                  <User />
                  <User />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Main>
  );
}
