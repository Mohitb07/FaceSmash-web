import { ChakraProvider } from '@chakra-ui/react';

import type { AppProps } from 'next/app';
import '../../styles/globals.css';
import UserDataProvider from '../context/authUser';
import { theme } from '../theme';


export default function App({ Component, pageProps }: AppProps) {
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
