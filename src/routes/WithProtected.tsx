import React, { useEffect } from 'react';

import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { useAuthUser } from '../hooks/useAuthUser';

export const withAuth = (Component: () => JSX.Element) => {
  return function WithAuthRouteProtection(props: any) {
    const { authUser, loading } = useAuthUser();
    const router = useRouter();
    useEffect(() => {
      console.log('inside effect', authUser, loading)
      if (!authUser && !loading) {
        console.log('inside redirect', authUser, loading)
        router.replace('/auth/login');
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, loading]);

    if (!authUser && loading) {
      return (
        <div className="h-screen w-screen z-50 flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      );
    }

    if(authUser && !loading){
      return <Component {...props} />;
    }

    return null;
  };
};

