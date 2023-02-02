import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useAuthUser } from '@/hooks/useAuthUser';

export const withAuth = (Component: () => JSX.Element) => {
  return function WithAuthRouteProtection(props: any) {
    const { authUser, loading, isVerified } = useAuthUser();
    const router = useRouter();
    useEffect(() => {
      if (!authUser && !loading) {
        router.replace('/auth/login');
      }
      if (authUser && !loading && !isVerified) {
        router.replace('/auth/verification');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading]);

    if (!authUser && loading) {
      return (
        <div className="z-50 flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      );
    }

    if (authUser && !loading) {
      return <Component {...props} />;
    }

    return null;
  };
};
