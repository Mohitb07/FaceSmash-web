import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { auth } from '../../firebase';

const DEFAULT_ERROR_VALUE = {
  email: '',
  password: '',
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(DEFAULT_ERROR_VALUE);
  const router = useRouter();

  async function onSignIn(email: string, password: string) {
    setLoading(true);
    setError(DEFAULT_ERROR_VALUE);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        router.push('/');
      }
    } catch (err: any) {
      console.log('Login error', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (errCode === 'auth/invalid-email') {
        setError({
          email: 'Invalid email address format',
          password: '',
        });
      } else if (
        errCode === 'auth/user-not-found' ||
        errCode === 'auth/wrong-password' ||
        errCode === 'auth/invalid-login-credentials' ||
        errCode === 'auth/invalid-credential' ||
        errMsg.includes('invalid-credential') ||
        errMsg.includes('user-not-found') ||
        errMsg.includes('wrong-password')
      ) {
        setError({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
      } else if (errCode === 'auth/too-many-requests') {
        setError({
          email: '',
          password: 'Too many failed attempts. Please try again later.',
        });
      } else {
        const readableError =
          errMsg.replace(/^Firebase:\s*/, '') || 'Failed to log in';
        setError({
          email: readableError,
          password: readableError,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, onSignIn, setError };
};
