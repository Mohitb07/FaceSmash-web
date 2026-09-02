import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

import { auth } from '../../firebase';

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const actionCodeSettings = {
        // After firebase resets the password, redirect back to the login page
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      setSuccess(true);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/user-not-found') {
        // Don't reveal if user exists — security best practice
        setSuccess(true);
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment and try again.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(
          msg.replace(/^Firebase:\s*/, '') ||
            'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, success, error, sendResetEmail };
};
