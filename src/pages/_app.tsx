import '../../styles/globals.css';
import '../../styles/Nprogress.css';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@/components/Error';
import UserDataProvider from '@/context/authUser';
import { useCheckOnlineStatus } from '@/hooks/useCheckOnlineStatus';
import { theme } from '@/theme';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  useCheckOnlineStatus();
  return (
    <UserDataProvider>
      <ChakraProvider theme={theme}>
        <div className="relative">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </div>
      </ChakraProvider>
    </UserDataProvider>
  );
}
