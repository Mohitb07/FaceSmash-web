import React, { useState } from 'react';
import {AuthError} from 'firebase/auth'
import { useAuthSignInWithEmailAndPassword } from "@react-query-firebase/auth";
import { Button } from '@chakra-ui/react';

import AuthLayout from '../../components/Auth/Layout';
import Input from '../../components/Input';
import { auth } from '../../../firebase';
import { FIREBASE_ERRORS } from '../../../firebase/error';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError>();

  async function onSignIn() {
    try {
      setLoading(true);
      mutation.mutate({ email, password });
    } catch (e) {
      console.log('error', e)
    } finally {
      setLoading(false);
    }
  }

  const mutation = useAuthSignInWithEmailAndPassword(auth, {
    onError(error) {
      setError(error);
    },
  });
  

  console.log('error found', error?.code)
  const disableLoginBtn = loading || !email || !password
  
  return (
    <AuthLayout
      meta="Login"
      footerText="Don't have an account?"
      footerLabel="Sign Up"
      footerLink="/auth/register"
    >
      <div className="mt-5 flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="" className="text-[#8E8FAB]">
            Email
          </label>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            isError={Boolean(error?.message)}
            errorText={FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
          />
        </div>

        <div className="flex flex-col space-y-1 pb-10">
          <label htmlFor="" className="text-[#8E8FAB]">
            Password
          </label>
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            isError={Boolean(error?.message)}
            errorText={FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
          />
        </div>
        <Button isLoading={loading} color="white" colorScheme="brand" size="md" isDisabled={disableLoginBtn} onClick={onSignIn}>
          Log in
        </Button>
      </div>
    </AuthLayout>
  );
};
export default Login;
