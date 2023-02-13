import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import React from 'react';

type StyledButtonProps = {
  children: any;
} & ButtonProps;

const StyledButton: React.FC<StyledButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      rounded="full"
      color="white"
      colorScheme="brand"
      variant="solid"
      {...props}
    >
      {children}
    </Button>
  );
};
export default StyledButton;
