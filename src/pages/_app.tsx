import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import '../../styles/globals.css';
import BottomNavigation from '../components/BottomNavigation';
import Sidebar from '../components/Sidebar';

import UserDataProvider from '../context/authUser';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserDataProvider>
      <ChakraProvider theme={theme}>
        <div className="relative">
          <div>
            <Sidebar />
          </div>
          <div className="bg-slate-900 fixed z-50 bottom-0 w-full">
            <BottomNavigation />
          </div>
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </UserDataProvider>
  );
}
