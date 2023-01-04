import AuthLayout from '../../components/Auth/Layout';
import Button from '../../components/Button';
import { withPublic } from '../../routes/WithPublic';

const Verification = () => {
  return (
    <AuthLayout
      meta="Verfication"
      footerLink="/auth/login"
      footerLabel="Log In"
      footerText="Login with your account"
      containerStyle="h-screen md:h-[400px]"
    >
      <div className="mt-5 flex flex-col space-y-6">
        <Button onClick={() => {}} label="Re Send Verification Code" />
        <Button
          onClick={() => {}}
          label="Already Verified?"
          style="bg-slate-700"
        />
      </div>
      <span className="flex font-bold items-center justify-center text-green-600 mt-10">
        Verification Code Resend
      </span>

      <span className="flex font-bold items-center justify-center text-red-600 mt-5">
        You are not verified
      </span>
    </AuthLayout>
  );
};
export default withPublic(Verification);
