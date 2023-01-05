import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { NextRouter } from 'next/router';

const DEFAULT_ERROR_VALUE = {
  email: '',
  password: '',
};

export const useRegister = (router: NextRouter) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(DEFAULT_ERROR_VALUE);

  function onSignUp(email: string, password: string) {
    setLoading(true);
    setError(DEFAULT_ERROR_VALUE);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('user logged in');
        router.replace('/');
      })
      .catch((error) => {
        console.log('error', error);
        if (error.code === 'auth/invalid-email') {
          setError((prev) => ({
            ...prev,
            email: error.message,
          }));
        } else if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          setError({
            email: error.message,
            password: error.message,
          });
        } else {
          console.log('SOME OTHER ERROR', error);
        }
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, onSignUp, setError };
};
