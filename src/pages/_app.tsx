import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';
import { theme } from '../theme';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
