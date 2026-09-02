import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheckCircle,
  FiMail,
} from 'react-icons/fi';
import * as yup from 'yup';

import Button from '@/components/Button';
import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import AuthLayout from '@/layouts/Auth';
import { withPublic } from '@/routes/WithPublic';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  })
  .required();

type FormInput = yup.InferType<typeof schema>;

const ForgotPassword = () => {
  const { loading, success, error, sendResetEmail } = useForgotPassword();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) =>
    sendResetEmail(data.email);

  if (success) {
    return (
      <AuthLayout meta="Forgot Password">
        <div className="mt-8 flex flex-col items-center space-y-5 text-center">
          {/* Success icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 ring-2 ring-purple-500/40">
            <FiCheckCircle className="text-3xl text-purple-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Check your inbox</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              If an account exists for{' '}
              <span className="font-semibold text-white">
                {getValues('email')}
              </span>
              , a password reset link has been sent.
            </p>
          </div>

          {/* Spam folder callout banner */}
          <div className="flex w-full items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-base text-amber-400" />
            <div className="text-xs leading-relaxed text-amber-200/90">
              <span className="font-semibold text-amber-300">
                Please check your Spam / Junk folder:
              </span>{' '}
              Because automated emails from Firebase free tier are sent from a
              shared domain, your email provider might filter the reset email
              into your spam or junk folder.
            </div>
          </div>

          {/* Email icon visual */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e2430] ring-1 ring-white/10">
            <FiMail className="text-2xl text-zinc-300" />
          </div>

          <p className="text-xs text-zinc-500">
            The link expires in 1 hour. Request a new one if needed.
          </p>

          <Link href="/auth/login" passHref legacyBehavior>
            <a className="mt-2 flex items-center gap-2 text-sm font-semibold text-purple-400 transition-colors hover:text-purple-300">
              <FiArrowLeft className="text-base" />
              <span>Back to Log In</span>
            </a>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      meta="Forgot Password"
      footerText="Remembered your password?"
      footerLabel="Log In"
      footerLink="/auth/login"
    >
      <div className="mt-6 space-y-1">
        <h2 className="text-lg font-bold text-white">Forgot your password?</h2>
        <p className="text-sm text-zinc-400">
          Enter your account email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex flex-col space-y-4"
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
                isInvalid={Boolean(error) || Boolean(errors.email?.message)}
                id="email"
                name="email"
                placeholder="Enter your account email"
                type="email"
                autoFocus
              />
            )}
          />
          <ErrorLabel error={error} validationError={errors.email?.message} />
        </div>

        <Button type="submit" isLoading={loading} size="md">
          Send Reset Link
        </Button>

        <Link href="/auth/login" passHref legacyBehavior>
          <a className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200">
            <FiArrowLeft className="text-base" />
            <span>Back to Log In</span>
          </a>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default withPublic(ForgotPassword);
