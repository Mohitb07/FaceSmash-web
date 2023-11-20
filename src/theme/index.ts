import { extendTheme } from '@chakra-ui/react';
import type { GlobalStyleProps } from '@chakra-ui/theme-tools';

const config = {
  // color mode user-preference configuration
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

export const theme = extendTheme({
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#000000' : 'gray.100',
      },
    }),
  },
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
