import { Text } from '@chakra-ui/react';
import React from 'react';

import { FIREBASE_ERRORS } from './../../../firebase/error';

type ErrorLabelProps = {
  error: string;
};

const ErrorLabel = ({ error }: ErrorLabelProps) => {
  return error.length ? (
    <Text fontSize="medium" color="crimson">
      {FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS]}
    </Text>
  ) : null;
};
export default ErrorLabel;
