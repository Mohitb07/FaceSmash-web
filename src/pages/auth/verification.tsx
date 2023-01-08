import { Spinner } from '@chakra-ui/react';
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthLayout from '../../components/Auth/Layout';
// import Button from '../../components/Button';
import { Button } from '@chakra-ui/react';
import { useAuthUser } from '../../hooks/useAuthUser';
import { withAuth } from '../../routes/WithProtected';

const Verification = () => {
  const router = useRouter();
  const user = getAuth();
  const { authUser, isVerified, loading, setIsVerified } = useAuthUser();
  const [currentStatus, setCurrentStatus] = useState({
    status: '',
    statusColor: '',
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (authUser && isVerified) {
      router.replace('/');
    }
  }, [authUser, isVerified, router]);

  const handleCheckVerificationStatus = async () => {
    setVerificationLoading(true);
    try {
      await user.currentUser?.reload();
      const currentUser = user.currentUser;
      if (currentUser) {
        setIsVerified(currentUser.emailVerified);
        if (currentUser.emailVerified) {
          setCurrentStatus({
            status: 'You are now verified',
            statusColor: 'text-green-600',
          });
        } else {
          setCurrentStatus({
            status: 'You are not verified',
            statusColor: 'text-red-600',
          });
        }
      }
    } catch (error) {
      console.log('Error while checking verification status', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setResendLoading(true);
    try {
      if (user.currentUser) {
        await sendEmailVerification(user.currentUser);
      }
    } catch (error) {
      console.log('VERIFICATION EMAIL SEND ERROR', error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogOut = () => {
    signOut(user)
      .then(() => {
        console.log('user logged out');
      })
      .catch((error) => {
        console.log('error while signing out', error);
      });
  };

  let content;
  if (authUser && !isVerified) {
    content = (
      <AuthLayout meta="Verfication" containerStyle="h-screen md:h-[400px]">
        <div className="mt-5 flex flex-col space-y-6">
          <h1 className="text-center">
            Verify - <span className="font-semibold">{authUser.email}</span>
          </h1>
          <Button
            isLoading={resendLoading}
            color="white"
            colorScheme="brand"
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={handleSendVerificationEmail}
          >
            Re Send Verification Code
          </Button>
          <Button
            isLoading={verificationLoading}
            color="white"
            colorScheme="brand"
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={handleCheckVerificationStatus}
          >
            Already Verified?
          </Button>
          <Button
            color="white"
            colorScheme="gray"
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </div>
        <span
          className={`flex font-bold items-center justify-center ${currentStatus.statusColor} mt-5`}
        >
          {currentStatus.status}
        </span>
      </AuthLayout>
    );
  } else if (authUser && isVerified) {
    content = (
      <AuthLayout
        meta="Verfication"
        footerLink="/"
        footerLabel="Home"
        footerText="Go Back to"
        containerStyle="h-screen md:h-[400px]"
      >
        <div className="mt-5 flex flex-col space-y-6">
          <h1 className="text-xl text-center">You are already verified</h1>
          <div className="flex justify-center items-center gap-5">
            <Spinner />
            <h2 className="text-center">Redirecting...</h2>
          </div>
        </div>
      </AuthLayout>
    );
  } else {
    return (
      <div className="h-screen w-screen z-50 flex justify-center items-center bg-slate-800">
        <Spinner size="xl" />
      </div>
    );
  }
  return content;
};
export default withAuth(Verification);
