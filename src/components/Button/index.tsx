import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import React from 'react';

type StyledButtonProps = {
  children: any;
} & ButtonProps;

const StyledButton: React.FC<StyledButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      rounded="full"
      color="white"
      colorScheme="brand"
      variant="solid"
    >
      {children}
    </Button>
  );
};
export default StyledButton;
