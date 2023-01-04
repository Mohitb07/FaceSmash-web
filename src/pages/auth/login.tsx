import React, { useState, useEffect } from 'react';

import {
  Button,
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
} from '@chakra-ui/react';

import AuthLayout from '../../components/Auth/Layout';
import { Input } from '@chakra-ui/react';
import { FIREBASE_ERRORS } from '../../../firebase/error';
import { useRouter } from 'next/router';
import { withPublic } from '../../routes/WithPublic';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const router = useRouter();
  const [loginFieldData, setLoginFieldData] = useState({
    email: '',
    password: '',
  });
  const { loading, error, onSignIn, setError } = useLogin(router);
  const [isShown, setIsShown] = useBoolean(false);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      email: '',
    }));
  }, [loginFieldData.email, setError]);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      password: '',
    }));
  }, [loginFieldData.password, setError]);

  const disableLoginBtn =
    loading || !loginFieldData.email || !loginFieldData.password;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLoginFieldData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

  const onSignInAttempt = () =>
    onSignIn(loginFieldData.email, loginFieldData.password);

  return (
    <AuthLayout
      meta="Login"
      footerText="Don't have an account?"
      footerLabel="Sign Up"
      footerLink="/auth/register"
    >
      <div className="mt-5 flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-[#8E8FAB]">
            Email
          </label>
          <Input
            isDisabled={loading}
            value={loginFieldData.email}
            onChange={handleChange}
            errorBorderColor="crimson"
            isInvalid={Boolean(error.email)}
            focusBorderColor="brand.100"
            id="email"
            name="email"
            size="lg"
            colorScheme="brand"
            variant="filled"
            placeholder="Email"
            type="email"
          />
          {error.email && (
            <Text fontSize="medium" color="crimson">
              {FIREBASE_ERRORS[error.email as keyof typeof FIREBASE_ERRORS]}
            </Text>
          )}
        </div>

        <div className="flex flex-col space-y-1 pb-10">
          <label htmlFor="password" className="text-[#8E8FAB]">
            Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={loginFieldData.password}
              errorBorderColor="crimson"
              isInvalid={Boolean(error.password)}
              focusBorderColor="brand.100"
              id="password"
              name="password"
              size="lg"
              colorScheme="brand"
              variant="filled"
              placeholder="Password"
              type={isShown ? 'text' : 'password'}
              onChange={handleChange}
            />
            {loginFieldData.password.length > 0 && (
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setIsShown.toggle}>
                  {isShown ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          {error.password && (
            <Text fontSize="medium" color="crimson">
              {FIREBASE_ERRORS[error.password as keyof typeof FIREBASE_ERRORS]}
            </Text>
          )}
        </div>
        <Button
          isLoading={loading}
          color="white"
          colorScheme="brand"
          size="md"
          isDisabled={disableLoginBtn}
          onClick={onSignInAttempt}
        >
          Log in
        </Button>
      </div>
    </AuthLayout>
  );
};
export default withPublic(Login);
