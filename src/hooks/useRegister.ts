import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { NextRouter } from 'next/router';
import { DEFAULT_PROFILE_PIC, USERS_COLLECTION } from '../constant';
import { db } from '../../firebase';

const DEFAULT_ERROR_VALUE = {
  email: '',
  password: '',
};

export const useRegister = (router: NextRouter) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(DEFAULT_ERROR_VALUE);

  const createUserAttempt = async (user: UserCredential, username: string) => {
    await sendEmailVerification(user.user);
    try {
      await setDoc(doc(db, USERS_COLLECTION, user.user.uid), {
        email: user.user.email,
        username: username,
        qusername: username.toLowerCase(),
        uid: user.user.uid,
        createdAt: user.user.metadata.creationTime,
        lastSignIn: user.user.metadata.lastSignInTime,
        profilePic: DEFAULT_PROFILE_PIC,
      });
      console.log('successfully created');
      router.replace('/');
    } catch (error) {
      console.log('registration error', error);
    }
  };

  function onSignUp(username: string, email: string, password: string) {
    setLoading(true);
    setError(DEFAULT_ERROR_VALUE);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('user registered');
        createUserAttempt(userCredential, username);
      })
      .catch((error) => {
        console.log('error', error.message);
        if (error.code === 'auth/invalid-email') {
          setError((prev) => ({
            ...prev,
            email: error.message,
          }));
        }
        if (error.code === 'auth/email-already-in-use') {
          setError((prev) => ({
            ...prev,
            email: error.message,
          }));
        }
        if (error.code === 'auth/weak-password') {
          setError((prev) => ({
            ...prev,
            password: error.message,
          }));
        }
      })
      .finally(() => setLoading(false));
  }

  return { loading, error, onSignUp, setError };
};
