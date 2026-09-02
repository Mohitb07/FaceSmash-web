import type { InputProps } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

const StyledInput = (
  props: InputProps,
  ref: React.LegacyRef<HTMLInputElement>
) => {
  return (
    <Input
      ref={ref}
      {...props}
      errorBorderColor="crimson"
      focusBorderColor="brand.100"
      size="lg"
      colorScheme="brand"
      variant="filled"
      rounded="lg"
      color="white"
      bg="#1e2430"
      _hover={{ bg: '#252d3d' }}
      _focus={{ bg: '#252d3d' }}
      _placeholder={{ color: 'whiteAlpha.400' }}
    />
  );
};
export default forwardRef(StyledInput);
