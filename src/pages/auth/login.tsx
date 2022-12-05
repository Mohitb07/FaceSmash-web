import React from 'react';
import AuthLayout from '../../components/Auth/Layout';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Login = () => {
  return (
    <AuthLayout
      meta="Login"
      footerText="Don't have an account?"
      footerLabel="Sign Up"
      footerLink="/auth/register"
    >
      <div className="mt-5 flex flex-col space-y-5">
        <div className='flex flex-col space-y-1'>
          <label htmlFor="" className='text-[#8E8FAB]'>Email</label>
          <Input type="email" placeholder="Email" />
        </div>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="" className='text-[#8E8FAB]'>Password</label>
          <Input type="password" placeholder="Password" />
        </div>
        <Button label="Log in" />
      </div>
    </AuthLayout>
  );
};
export default Login;
