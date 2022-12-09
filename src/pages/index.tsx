import Feed from '../components/Feed';
import Sidebar from '../components/Sidebar';
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
      <div className="flex h-screen">
        {/* <div className="">
          <Sidebar />
        </div> */}
        <div className="flex-1">
          <div className="flex md:p-10 justify-center items-start gap-10">
            <main className="space-y-5 md:ml-[20%] xl:ml-[10%]">
              <Feed />
              <Feed />
              <Feed />
              <Feed />
            </main>
            <aside className="hidden lg:flex flex-col">
              <div className="flex  items-center gap-5 mt-10">
                <User size="large" />
              </div>
              <div className='mt-5'>
                <p className="text-xl text-gray-500 font-semibold">
                  Suggestions for you
                </p>
                <div>
                  <User/>
                  <User/>
                  <User/>
                  <User/>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Main>
  );
}
