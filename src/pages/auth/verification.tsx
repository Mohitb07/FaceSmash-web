import { Spinner } from '@chakra-ui/react';
import { sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import { useAuthUser } from '@/hooks/useAuthUser';
import AuthLayout from '@/layouts/Auth';
import { withAuth } from '@/routes/WithProtected';

import { auth } from '../../../firebase';

const Verification = () => {
  const router = useRouter();
  const { authUser, isVerified, loading, setIsVerified, logout } =
    useAuthUser();
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

  // Background interval polling to automatically detect email verification
  useEffect(() => {
    if (!authUser || isVerified) return;

    const intervalId = setInterval(async () => {
      try {
        if (auth.currentUser) {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            setIsVerified(true);
            setCurrentStatus({
              status: 'Email verified! Redirecting...',
              statusColor: 'text-green-600',
            });
          }
        }
      } catch (err) {
        console.log('Background verification poll error', err);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [authUser, isVerified, setIsVerified]);

  const handleCheckVerificationStatus = async () => {
    setVerificationLoading(true);
    try {
      await auth.currentUser?.reload();
      const currentUser = auth.currentUser;
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
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      console.log('VERIFICATION EMAIL SEND ERROR', error);
    } finally {
      setResendLoading(false);
    }
  };

  let content;
  if (authUser && !isVerified) {
    content = (
      <AuthLayout meta="Verification" containerStyle="h-screen md:h-[400px]">
        <div className="mt-5 flex flex-col space-y-6">
          <h1 className="text-center">
            Verify - <span className="font-semibold">{authUser.email}</span>
          </h1>
          <Button
            isLoading={resendLoading}
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={handleSendVerificationEmail}
          >
            Re Send Verification Code
          </Button>
          <Button
            isLoading={verificationLoading}
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={handleCheckVerificationStatus}
          >
            Already Verified?
          </Button>
          <Button
            size="md"
            isDisabled={verificationLoading || resendLoading || loading}
            onClick={logout}
          >
            Log Out
          </Button>
        </div>
        <p className="mt-4 text-center text-xs font-medium text-zinc-400">
          Auto-checking verification status in background...
        </p>
        <span
          className={`flex-container font-bold ${currentStatus.statusColor} mt-3`}
        >
          {currentStatus.status}
        </span>
      </AuthLayout>
    );
  } else if (authUser && isVerified) {
    content = (
      <AuthLayout
        meta="Verification"
        footerLink="/"
        footerLabel="Home"
        footerText="Go Back to"
        containerStyle="h-screen md:h-[400px]"
      >
        <div className="mt-5 flex flex-col space-y-6">
          <h1 className="text-center text-xl">You are already verified</h1>
          <div className="flex-container gap-5">
            <Spinner />
            <h2 className="text-center">Redirecting...</h2>
          </div>
        </div>
      </AuthLayout>
    );
  } else {
    return (
      <div className="flex-container z-50 h-screen w-screen bg-black/60">
        <Spinner size="xl" />
      </div>
    );
  }
  return content;
};
export default withAuth(Verification);
