import { Text } from '@chakra-ui/react';
import React from 'react';

import { FIREBASE_ERRORS } from './../../../firebase/error';

type ErrorLabelProps = {
  error?: string;
  validationError?: string;
};

const ErrorLabel = ({ error, validationError }: ErrorLabelProps) => {
  if (validationError) {
    return (
      <Text role="alert" aria-live="polite" fontSize="sm" color="crimson">
        {validationError}
      </Text>
    );
  }

  if (error && error.length > 0) {
    const message =
      FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS] || error;
    return (
      <Text role="alert" aria-live="polite" fontSize="sm" color="crimson">
        {message}
      </Text>
    );
  }

  return null;
};
export default ErrorLabel;
