import { collection, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import FeedContainer from '@/common/FeedContainer';
import Navigation from '@/common/Navigation';
import ErrorFallback from '@/components/Error';
import UserDetail from '@/components/Profile/UserDetails';
import { POSTS_COLLECTION } from '@/constant';
import { useGetUser } from '@/hooks/useGetUser';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';

import { db } from '../../../firebase';

const UserProfile = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { userDetail, isUserDetailLoading } = useGetUser(userId);
  const postQuery = useMemo(
    () =>
      query(
        collection(db, POSTS_COLLECTION),
        where('uid', '==', userId),
        orderBy('createdAt', 'desc')
      ),
    [userId]
  );

  const user = useMemo(() => userDetail, [userDetail]);

  return (
    <Main
      meta={
        <Meta
          title={`${user?.username} (${user?.email}) - FaceSmash`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div>
        <Navigation />
      </div>
      <div className="flex flex-col justify-start space-y-3 md:items-center md:justify-center md:space-y-10 md:p-10 lg:ml-[10%] xl:ml-0">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <UserDetail
            isLoading={isUserDetailLoading}
            user={userDetail}
            userId={userId}
            userQuery={postQuery}
          />
        </ErrorBoundary>

        <div className="space-y-5 pb-16">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedContainer userId={userId} customQuery={postQuery} />
          </ErrorBoundary>
        </div>
      </div>
    </Main>
  );
};
export default withAuth(UserProfile);
