import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { IoIosRefresh } from 'react-icons/io';

import Button from '@/components/Button';

type TestingProps = {};

dayjs.extend(relativeTime);

const Testing: React.FC<TestingProps> = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full" role="alert">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl font-bold">Something went wrong 😢</p>
          <pre className="text-lg">Some error</pre>
          <Button bgColor="white" color="black" rightIcon={<IoIosRefresh />}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Testing;
