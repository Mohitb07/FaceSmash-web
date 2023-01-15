import type { AppProps } from 'next/app';

import { ChakraProvider } from '@chakra-ui/react';

import '../../styles/globals.css';
import UserDataProvider from '../context/authUser';
import { useCheckOnlineStatus } from '../hooks/useCheckOnlineStatus';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  useCheckOnlineStatus()
  return (
    <UserDataProvider>
      <ChakraProvider theme={theme}>
        <div className="relative">
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </UserDataProvider>
  );
}
