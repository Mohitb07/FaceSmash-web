import React, { useEffect } from 'react';

import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { useAuthUser } from '../hooks/useAuthUser';

export const withPublic = (Component: () => JSX.Element) => {
  return function WithPublic(props: any) {
    const { authUser, loading } = useAuthUser();
    const router = useRouter();
    useEffect(() => {
      console.log('pathname', window.location.pathname);
      if (authUser && !loading) {
        router.replace('/');
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser]);

    if (!authUser && loading) {
      return (
        <div className="h-screen w-screen z-50 flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      );
    }

    if(!authUser && loading){
      return <Component {...props} />;
    }
  };
};

