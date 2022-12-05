import React from 'react';
import AuthLayout from '../../components/Auth/Layout';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Register = () => {
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
          <label htmlFor="" className="text-[#8E8FAB]">
            Username
          </label>
          <Input placeholder="Username" />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="" className="text-[#8E8FAB]">
            Email
          </label>
          <Input type="email" placeholder="Email" />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="" className="text-[#8E8FAB]">
            Password
          </label>
          <Input type="password" placeholder="Password" />
        </div>
        <div className="flex flex-col space-y-1 pb-10">
          <label htmlFor="" className="text-[#8E8FAB]">
            Confirm Password
          </label>
          <Input type="password" placeholder="Confirm Password" />
        </div>
        <Button label="Sign Up"/>{' '}
      </div>
    </AuthLayout>
  );
};
export default Register;
