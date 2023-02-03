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
    />
  );
};
export default forwardRef(StyledInput);
