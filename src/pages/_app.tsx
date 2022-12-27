import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../styles/globals.css';
import BottomNavigation from '../components/BottomNavigation';
import Sidebar from '../components/Sidebar';

import AuthUserProvider from '../context/authUser';
import UserDataProvider from '../context/user';
import { theme } from '../theme';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthUserProvider>
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
      </AuthUserProvider>
    </QueryClientProvider>
  );
}
