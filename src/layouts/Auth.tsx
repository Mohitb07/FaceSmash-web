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
          title={`faceSmash - ${meta}`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="layout-wrapper min-h-screen bg-black/60">
        <div className="flex items-center gap-16">
          <div className="hidden lg:block">
            <Image
              className="layout-image"
              src="https://i.postimg.cc/tg77N3Rm/m2.png"
              alt="authentication page app showcase"
              objectFit="contain"
              height={700}
              width={400}
            />
          </div>
          <div>
            <div
              className={`h-screen w-screen p-5 md:h-auto md:w-[500px] md:p-16 ${containerStyle} rounded-md bg-gray-900`}
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
            <div className="md:flex-container mt-5 hidden h-20 w-[500px]">
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
      </div>
    </Main>
  );
};
export default Layout;
