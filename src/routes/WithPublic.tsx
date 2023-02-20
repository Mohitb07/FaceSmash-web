import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useAuthUser } from '@/hooks/useAuthUser';

export const withPublic = (Component: () => JSX.Element) => {
  return function WithPublic(props: any) {
    const { authUser, loading } = useAuthUser();
    const router = useRouter();
    useEffect(() => {
      if (authUser && !loading) {
        router.replace('/');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser]);

    if (loading) {
      return (
        <div className="flex-container z-50 h-screen w-screen">
          <Spinner size="xl" />
        </div>
      );
    }

    if (!authUser && !loading) {
      console.log('executed', authUser, loading);
      return <Component {...props} />;
    }

    return null;
  };
};
