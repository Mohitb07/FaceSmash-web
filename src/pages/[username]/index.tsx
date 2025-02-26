import { SlideFade } from '@chakra-ui/react';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import FeedContainer from '@/common/FeedContainer';
import Navigation from '@/common/Navigation';
import Brand from '@/components/Brand';
import ErrorFallback from '@/components/Error';
import UserRecommendation from '@/components/UserRecommendation';
import { POSTS_COLLECTION } from '@/constant';
import { useGetPosts } from '@/hooks/useGetPosts';
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
  const { postsLoading } = useGetPosts();

  return (
    <Main
      meta={
        <Meta
          title={`FaceSmash - Profile ${user.email}`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <header className="fixed inset-x-0 top-0 z-50 bg-black text-center md:hidden">
        <Brand />
      </header>

      {/* <div className="md:flex md:h-screen">
        <div className="max-w-lg overflow-y-auto border-r border-neutral-900 lg:w-1/6">
          <Navigation />
        </div>
        <div className="flex-1 overflow-y-auto">
          <main className="">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <FeedContainer
                customQuery={postQuery}
                user={userDetail}
                isLoading={isUserDetailLoading}
                userId={userId}
                isProfile
              />
            </ErrorBoundary>
          </main>
        </div>
        <aside className="p-3 lg:w-1/4">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <UserRecommendation />
            </ErrorBoundary>
          </SlideFade>
        </aside>
      </div> */}
      <div className="wrapper">
        <div className="nav-container">
          <Navigation />
        </div>
        <main className="feed-container">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedContainer
              customQuery={postQuery}
              user={userDetail}
              isLoading={isUserDetailLoading}
              userId={userId}
              isProfile
            />
          </ErrorBoundary>
        </main>
        <aside className="recommendation-container">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <UserRecommendation />
            </ErrorBoundary>
          </SlideFade>
        </aside>
      </div>
    </Main>
  );
};
export default withAuth(UserProfile);

{
  /* <ErrorBoundary FallbackComponent={ErrorFallback}>
<UserDetail
  isLoading={isUserDetailLoading}
  user={userDetail}
  userId={userId}
  userQuery={postQuery}
/>
</ErrorBoundary> */
}
