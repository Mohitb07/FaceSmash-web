import { Button } from '@chakra-ui/react';
import { IoIosRefresh } from 'react-icons/io';

function ErrorFallback({
  // error,
  resetErrorBoundary,
}: {
  // error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center justify-center space-y-4 p-3"
    >
      <p className="text-xl font-bold">Something went wrong 😢</p>
      {/* <pre className="text-lg">{error.message}</pre> */}
      <Button
        onClick={resetErrorBoundary}
        bgColor="white"
        color="black"
        rightIcon={<IoIosRefresh />}
        _hover={{ bgColor: 'white', color: 'black' }}
      >
        Try Again
      </Button>
    </div>
  );
}

export default ErrorFallback;
