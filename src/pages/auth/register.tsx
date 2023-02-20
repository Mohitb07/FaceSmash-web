import {
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import Button from '@/components/Button';
import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useRegister } from '@/hooks/useRegister';
import AuthLayout from '@/layouts/Auth';
import { withPublic } from '@/routes/WithPublic';

const Register = () => {
  const [registerFieldData, setRegisterFieldData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [charactersLeft, setCharactersLeft] = useState(30);
  const [isShown, setIsShown] = useBoolean(false);
  const { loading, error, onSignUp } = useRegister();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFieldData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 30) {
      return;
    }
    setRegisterFieldData((prev) => ({
      ...prev,
      username: event.target.value,
    }));
    setCharactersLeft(30 - event.target.value.length);
  };

  const isPasswordMatch =
    registerFieldData.password === registerFieldData.confirmPassword;
  const confirmPasswordLabel = "Password doesn't match";

  const onRegisterAttempt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignUp(
      registerFieldData.username,
      registerFieldData.email,
      registerFieldData.password
    );
  };

  return (
    <AuthLayout
      meta="Sign Up"
      footerText="Already have an account?"
      footerLabel="Log In"
      footerLink="/auth/login"
      containerStyle="h-screen md:h-[800px]"
    >
      <form
        noValidate
        onSubmit={onRegisterAttempt}
        className="mt-5 flex flex-col space-y-2"
      >
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="form-label-text">
            Username
          </label>
          <Input
            isDisabled={loading}
            value={registerFieldData.username}
            onChange={handleUsername}
            isInvalid={charactersLeft === 0}
            id="username"
            name="username"
            placeholder="Enter your username"
            type="text"
          />
          {registerFieldData.username.length > 0 && (
            <Text
              fontSize="sm"
              paddingLeft="4"
              color={charactersLeft > 0 ? 'white' : 'crimson'}
            >
              Characters left {charactersLeft}
            </Text>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="form-label-text">
            Email
          </label>
          <Input
            isDisabled={loading}
            value={registerFieldData.email}
            onChange={handleChange}
            isInvalid={Boolean(error.email)}
            id="email"
            name="email"
            placeholder="Email"
            type="email"
          />
          <ErrorLabel error={error.email} />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="form-label-text">
            Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={registerFieldData.password}
              isInvalid={Boolean(error.password)}
              id="password"
              name="password"
              placeholder="Password"
              type={isShown ? 'text' : 'password'}
              onChange={handleChange}
            />
            {registerFieldData.password.length > 0 && (
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setIsShown.toggle}>
                  {isShown ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          <ErrorLabel error={error.password} />
        </div>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="password" className="form-label-text">
            Confirm Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={registerFieldData.confirmPassword}
              isInvalid={
                registerFieldData.confirmPassword.length > 0 && !isPasswordMatch
              }
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-Enter your password"
              type={isShown ? 'text' : 'password'}
              onChange={handleChange}
            />
            {registerFieldData.confirmPassword.length > 0 && (
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setIsShown.toggle}>
                  {isShown ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          {registerFieldData.confirmPassword.length > 0 && !isPasswordMatch && (
            <Text fontSize="medium" color="crimson">
              {confirmPasswordLabel}
            </Text>
          )}
        </div>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          Sign Up
        </Button>
      </form>
    </AuthLayout>
  );
};
export default withPublic(Register);
