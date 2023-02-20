import { InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import Button from '@/components/Button';
import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useLogin } from '@/hooks/useLogin';
import AuthLayout from '@/layouts/Auth';
import { withPublic } from '@/routes/WithPublic';

const Login = () => {
  const [loginFieldData, setLoginFieldData] = useState({
    email: '',
    password: '',
  });
  const { loading, error, onSignIn, setError } = useLogin();
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

  const onSignInAttempt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn(loginFieldData.email, loginFieldData.password);
  };

  return (
    <AuthLayout
      meta="Login"
      footerText="Don't have an account?"
      footerLabel="Sign Up"
      footerLink="/auth/register"
    >
      <form
        noValidate
        onSubmit={onSignInAttempt}
        className="mt-5 flex flex-col space-y-2"
      >
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="form-label-text">
            Email
          </label>
          <Input
            isDisabled={loading}
            value={loginFieldData.email}
            onChange={handleChange}
            isInvalid={Boolean(error.email)}
            id="email"
            name="email"
            placeholder="Email"
            type="email"
          />
          <ErrorLabel error={error.email} />
        </div>

        <div className="flex flex-col space-y-1 pb-10">
          <label htmlFor="password" className="form-label-text">
            Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={loginFieldData.password}
              isInvalid={Boolean(error.password)}
              id="password"
              name="password"
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
          <ErrorLabel error={error.password} />
        </div>
        <Button
          type="submit"
          isLoading={loading}
          size="md"
          isDisabled={disableLoginBtn}
        >
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};
export default withPublic(Login);
