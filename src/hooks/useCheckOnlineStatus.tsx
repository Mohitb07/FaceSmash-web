import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

export const useCheckOnlineStatus = () => {
  const toast = useToast();
  useEffect(() => {
    function handleOnline() {
      toast({
        title: `You are back Online`,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'purple',
        icon: <FiWifi className="text-2xl" />,
      });
    }
    function handleOffline() {
      toast({
        title: `You are now offline`,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'purple',
        icon: <FiWifiOff className="text-2xl" />,
      });
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
};
