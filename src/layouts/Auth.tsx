import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

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
      <div className="flex-container min-h-screen">
        <div className="hidden items-center  justify-center pt-16 lg:flex">
          <Image
            src="https://static.cdninstagram.com/rsrc.php/v3/y4/r/ItTndlZM2n2.png"
            alt=""
            height={800}
            width={600}
          />
        </div>
        <div>
          <div
            className={`bg-color h-screen w-screen p-5 md:h-auto md:w-[500px] md:p-16 ${containerStyle}`}
          >
            <header>
              <h1 className="text-center text-5xl font-bold text-white">
                <span className="text-primary-100">Face</span>Smash
              </h1>
            </header>
            <div className="flex-1">{children}</div>
            <div className="mt-10 text-center md:hidden">
              <Link href={footerLink}>
                <h1 className="form-label-text text-sm">
                  {footerText}{' '}
                  <span className="font-bold text-primary-100">
                    {footerLabel}
                  </span>
                </h1>
              </Link>
            </div>
          </div>
          <div
            className={`md:flex-container bg-color mt-5 hidden h-20 w-[500px]`}
          >
            <Link href={footerLink}>
              <h1 className="form-label-text text-lg">
                {footerText}{' '}
                <span className="cursor-pointer font-bold text-primary-100">
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
