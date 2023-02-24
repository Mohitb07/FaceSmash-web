import {
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@/components/Button';
import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useRegister } from '@/hooks/useRegister';
import AuthLayout from '@/layouts/Auth';
import { withPublic } from '@/routes/WithPublic';

const schema = yup
  .object({
    username: yup
      .string()
      .max(30, 'Username cannot exceed 30 characters')
      .required('Username is a required field'),
    email: yup
      .string()
      .email('Email must be a valid email')
      .required('Email is a required field'),
    password: yup
      .string()
      .required('Password is a required field')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm Password is a required field')
      .oneOf([yup.ref('password'), ''], 'Password must match'),
  })
  .required();

type FormInput = yup.InferType<typeof schema>;

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [isShown, setIsShown] = useBoolean(false);
  const { loading, error, onSignUp } = useRegister();
  const username = watch('username');
  const charactersLeft = 30 - (username?.length || 0);

  const onRegisterAttempt: SubmitHandler<FormInput> = (data) =>
    onSignUp(data.username, data.email, data.password);

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
        onSubmit={handleSubmit(onRegisterAttempt)}
        className="mt-5 flex flex-col space-y-2"
      >
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="form-label-text">
            Username
          </label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={30}
                isInvalid={Boolean(errors.username?.message)}
                isDisabled={loading}
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
              />
            )}
          />
          {username.length > 0 && (
            <Text
              fontSize="sm"
              paddingLeft="4"
              color={charactersLeft > 0 ? 'white' : 'crimson'}
            >
              Characters left: {charactersLeft}
            </Text>
          )}
          <ErrorLabel validationError={errors.username?.message} />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="form-label-text">
            Email
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                isDisabled={loading}
                isInvalid={
                  Boolean(error.email) || Boolean(errors?.email?.message)
                }
                id="email"
                name="email"
                placeholder="Email"
                type="email"
              />
            )}
          />
          <ErrorLabel
            error={error.email}
            validationError={errors.email?.message}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="form-label-text">
            Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputGroup size="lg">
                <Input
                  {...field}
                  isDisabled={loading}
                  isInvalid={
                    Boolean(error.password) || Boolean(errors.password?.message)
                  }
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={isShown ? 'text' : 'password'}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={setIsShown.toggle}>
                    {isShown ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
          />
          <ErrorLabel
            error={error.password}
            validationError={errors.password?.message}
          />
        </div>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="confirmPassword" className="form-label-text">
            Confirm Password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <InputGroup size="lg">
                <Input
                  {...field}
                  isDisabled={loading}
                  isInvalid={Boolean(errors.confirmPassword?.message)}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={isShown ? 'text' : 'password'}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={setIsShown.toggle}>
                    {isShown ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
          />
          <ErrorLabel validationError={errors.confirmPassword?.message} />
        </div>
        <Button type="submit" isLoading={loading} isDisabled={loading}>
          Sign Up
        </Button>
      </form>
    </AuthLayout>
  );
};
export default withPublic(Register);
