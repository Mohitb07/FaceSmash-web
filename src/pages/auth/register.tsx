import React, { useState } from 'react';

import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
} from '@chakra-ui/react';

import { withPublic } from '../../routes/WithPublic';
import { FIREBASE_ERRORS } from '../../../firebase/error';
import { useRegister } from '../../hooks/useRegister';
import AuthLayout from '../../layouts/Auth';


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

  return (
    <AuthLayout
      meta="Sign Up"
      footerText="Already have an account?"
      footerLabel="Log In"
      footerLink="/auth/login"
      containerStyle="h-screen md:h-[800px]"
    >
      <div className="mt-5 flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-[#8E8FAB]">
            Username
          </label>
          <Input
            isDisabled={loading}
            value={registerFieldData.username}
            onChange={handleUsername}
            errorBorderColor="crimson"
            isInvalid={charactersLeft === 0}
            focusBorderColor="brand.100"
            id="username"
            name="username"
            size="lg"
            colorScheme="brand"
            variant="filled"
            placeholder="Enter your username"
            type="text"
          />
          <Text
            fontSize="sm"
            paddingLeft="4"
            color={charactersLeft > 0 ? 'white' : 'crimson'}
          >
            Characters left {charactersLeft}
          </Text>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-[#8E8FAB]">
            Email
          </label>
          <Input
            isDisabled={loading}
            value={registerFieldData.email}
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
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-[#8E8FAB]">
            Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={registerFieldData.password}
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
            {registerFieldData.password.length > 0 && (
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
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="password" className="text-[#8E8FAB]">
            Confirm Password
          </label>
          <InputGroup size="lg">
            <Input
              isDisabled={loading}
              value={registerFieldData.confirmPassword}
              errorBorderColor="crimson"
              isInvalid={
                registerFieldData.confirmPassword.length > 0 && !isPasswordMatch
              }
              focusBorderColor="brand.100"
              id="confirmPassword"
              name="confirmPassword"
              size="lg"
              colorScheme="brand"
              variant="filled"
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
        <Button
          isLoading={loading}
          color="white"
          colorScheme="brand"
          size="md"
          isDisabled={loading}
          onClick={() =>
            onSignUp(
              registerFieldData.username,
              registerFieldData.email,
              registerFieldData.password
            )
          }
        >
          Sign Up
        </Button>
      </div>
    </AuthLayout>
  );
};
export default withPublic(Register);
