import Image from 'next/image';
import React from 'react';
import { Meta } from '../../layouts/Meta';

import { Main } from '../../templates/Main';

const Login = () => {
  return (
    <Main
      meta={
        <Meta
          title="FaceSmash - Login"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="hidden lg:flex  items-center justify-center pt-16">
          <Image
            src="https://static.cdninstagram.com/rsrc.php/v3/y4/r/ItTndlZM2n2.png"
            alt=""
            height={800}
            width={600}
          />
        </div>
        <div>
          <div className="w-screen h-screen md:h-[500px] md:w-[500px] bg-[#19181A] p-16">
            <header>
              <h1 className="text-center text-5xl font-bold text-white">
                <span className="text-primary-100">Face</span>Smash
              </h1>
            </header>
            <div className="mt-5 flex flex-col space-y-5">
              <input
                type="text"
                className="rounded-md border-none bg-[#3D3D40] px-4 py-3 text-base text-white caret-white placeholder:text-[#8E8FAB] focus:outline-none"
                placeholder="Email"
              />
              <input
                type="password"
                className="rounded-md border-none bg-[#3D3D40] px-4 py-3 text-base text-white caret-white placeholder:text-[#8E8FAB] focus:outline-none"
                placeholder="Password"
              />
              <button className="rounded-lg bg-primary-100 py-2 text-base font-semibold text-white">
                Log in
              </button>
            </div>
            <div className="md:hidden text-center mt-10">
              <h1 className="text-sm text-[#8E8FAB]">
                Don&apos;t have an account?{' '}
                <span className="text-primary-100 font-bold">Sign up</span>
              </h1>
            </div>
          </div>
          <div className="h-20 mt-5 w-[500px] bg-[#19181A] items-center justify-center hidden md:flex">
            <h1 className="text-lg text-[#8E8FAB]">
              Don&apos;t have an account?{' '}
              <span className="text-primary-100 font-bold">Sign up</span>
            </h1>
          </div>
        </div>
      </div>
    </Main>
  );
};
export default Login;
