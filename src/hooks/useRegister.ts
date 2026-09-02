import { useToast } from '@chakra-ui/react';
import type { UserCredential } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { DEFAULT_PROFILE_PIC, USERS_COLLECTION } from '@/constant';

import { auth, db } from '../../firebase';

const DEFAULT_ERROR_VALUE = {
  email: '',
  password: '',
  username: '',
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(DEFAULT_ERROR_VALUE);
  const router = useRouter();
  const toast = useToast();

  const createUserAttempt = async (user: UserCredential, username: string) => {
    try {
      await sendEmailVerification(user.user);
      await setDoc(doc(db, USERS_COLLECTION, user.user.uid), {
        email: user.user.email,
        username,
        qusername: username.toLowerCase(),
        uid: user.user.uid,
        createdAt: user.user.metadata.creationTime,
        lastSignIn: user.user.metadata.lastSignInTime,
        profilePic: DEFAULT_PROFILE_PIC,
      });
      router.push('/auth/verification');
    } catch (err: any) {
      console.log('Registration profile creation error', err);
      // Clean up orphaned auth user if firestore doc creation failed
      try {
        await user.user.delete();
      } catch (deleteErr) {
        console.log('Failed to rollback auth user', deleteErr);
      }
      toast({
        title: 'Failed to create user profile. Please try again.',
        status: 'error',
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  };

  async function onSignUp(username: string, email: string, password: string) {
    setLoading(true);
    setError(DEFAULT_ERROR_VALUE);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserAttempt(userCredential, username);
    } catch (err: any) {
      console.log('Registration error', err);
      if (
        err.code === 'auth/invalid-email' ||
        err.code === 'auth/email-already-in-use'
      ) {
        setError((prev) => ({
          ...prev,
          email:
            err.code === 'auth/email-already-in-use'
              ? 'A user with that email already exists'
              : 'Invalid email format',
        }));
      } else if (err.code === 'auth/weak-password') {
        setError((prev) => ({
          ...prev,
          password: 'Password should be at least 6 characters long',
        }));
      } else {
        toast({
          title: 'Something went wrong',
          status: 'error',
          variant: 'left-accent',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, onSignUp, setError };
};
