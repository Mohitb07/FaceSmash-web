import { InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@/components/Button';
import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useLogin } from '@/hooks/useLogin';
import AuthLayout from '@/layouts/Auth';
import { withPublic } from '@/routes/WithPublic';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Email must be a valid email')
      .required('Email is a required field'),
    password: yup.string().required('Password is a required field'),
  })
  .required();

type FormInput = yup.InferType<typeof schema>;

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { loading, error, onSignIn } = useLogin();
  const [isShown, setIsShown] = useBoolean(false);

  const onSignInAttempt: SubmitHandler<FormInput> = (data) =>
    onSignIn(data.email, data.password);

  return (
    <AuthLayout
      meta="Login"
      footerText="Don't have an account?"
      footerLabel="Sign Up"
      footerLink="/auth/register"
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSignInAttempt)}
        className="mt-5 flex flex-col space-y-2"
      >
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

        <div className="flex flex-col space-y-1 pb-10">
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
                  isInvalid={Boolean(error.password)}
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
        <Button type="submit" isLoading={loading} size="md">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};
export default withPublic(Login);
