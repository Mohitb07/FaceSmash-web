import { Main } from '../../templates/Main';
import Image from 'next/image';
import React from 'react';
import { Meta } from '../../layouts/Meta';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
  meta: string;
  footerText?: string;
  footerLabel?: string;
  footerLink?: string;
  containerStyle?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  meta = '',
  footerText = '',
  footerLabel = '',
  footerLink = '',
  containerStyle = '',
}) => {
  return (
    <Main
      meta={
        <Meta
          title={`FaceSmash - ${meta}`}
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
          <div className={`w-screen h-screen md:h-auto md:w-[500px] bg-[#19181A] p-5 md:p-16 ${containerStyle}`}>
            <header>
              <h1 className="text-center text-5xl font-bold text-white">
                <span className="text-primary-100">Face</span>Smash
              </h1>
            </header>
            <div className='flex-1'>
              {children}
            </div>
            <div className="md:hidden text-center mt-10">
              <Link href={footerLink}>
                <h1 className="text-sm text-[#8E8FAB]">
                  {footerText}{' '}
                  <span className="text-primary-100 font-bold">
                    {footerLabel}
                  </span>
                </h1>
              </Link>
            </div>
          </div>
          <div className="h-20 mt-5 w-[500px] bg-[#19181A] items-center justify-center hidden md:flex">
            <Link href={footerLink}>
              <h1 className="text-lg text-[#8E8FAB]">
                {footerText}{' '}
                <span className="text-primary-100 font-bold cursor-pointer">
                  {footerLabel}
                </span>
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
};
export default Layout;
