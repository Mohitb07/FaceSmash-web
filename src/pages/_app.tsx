import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, cookieStorageManagerSSR } from '@chakra-ui/react';

import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

const config = {
  // color mode user-preference configuration 
  useSystemColorMode: false,
initialColorMode: 'dark',
}

export const theme = extendTheme({
  colors: {
    brand: {
      100: '#6e3ddc',
      200: '#6337c6',
      300: '#5831b0',
      400: '#4d2b9a',
      500: '#422584',
      600: '#371f6e',
      700: '#2c1858',
      800: '#211242',
      900: '#160c2c',
    },
  },
  config,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}
