import { extendTheme } from '@chakra-ui/react';
import type { GlobalStyleProps } from '@chakra-ui/theme-tools';

export const COLORS = {
  primary: {
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
  gray: {
    100: '#0C1014',
    200: '#27272A',
    300: '#3A3A3B',
    400: '#4A4A4B',
    500: '#606061',
    600: '#828285',
    700: '#9E9EA0',
    800: '#B0B0B2',
    900: '#C8C8CA',
  },
};

const config = {
  // color mode user-preference configuration
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

export const theme = extendTheme({
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0C1014' : 'gray.100',
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
