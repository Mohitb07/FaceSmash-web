import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

const DEFAULT_ERROR_VALUE = {
  email: '',
  password: '',
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(DEFAULT_ERROR_VALUE);

  function onSignIn(email: string, password: string) {
    setLoading(true);
    setError(DEFAULT_ERROR_VALUE);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        if (user) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log('error', err);
        if (err.code === 'auth/invalid-email') {
          setError((prev) => ({
            ...prev,
            email: err.message,
          }));
        } else if (
          err.code === 'auth/user-not-found' ||
          err.code === 'auth/wrong-password'
        ) {
          setError({
            email: err.message,
            password: err.message,
          });
        } else {
          console.log('SOME OTHER ERROR', error);
        }
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, onSignIn, setError };
};
