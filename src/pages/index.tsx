import { SlideFade } from '@chakra-ui/react';
import { collection, orderBy, query } from 'firebase/firestore';
import { ErrorBoundary } from 'react-error-boundary';

import FeedContainer from '@/common/FeedContainer';
import Navigation from '@/common/Navigation';
import Brand from '@/components/Brand';
import ErrorFallback from '@/components/Error';
import UserRecommendation from '@/components/UserRecommendation';
import { POSTS_COLLECTION } from '@/constant';
import { useGetPosts } from '@/hooks/useGetPosts';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';

import { db } from '../../firebase';

const postQuery = query(
  collection(db, POSTS_COLLECTION),
  orderBy('createdAt', 'desc')
);

function Home() {
  const { postsLoading } = useGetPosts();

  return (
    <Main
      meta={
        <Meta
          title="FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <header className="fixed inset-x-0 top-0 z-50 bg-black text-center md:hidden">
        <Brand />
      </header>
      <div className="overflow-hidden md:flex md:h-screen">
        <div className="h-full overflow-y-auto lg:w-1/4">
          <Navigation />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedContainer customQuery={postQuery} />
          </ErrorBoundary>
        </div>
        <div className="overflow-y-auto p-3 lg:w-1/4">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <UserRecommendation />
            </ErrorBoundary>
          </SlideFade>
        </div>
      </div>
    </Main>
  );
}

export default withAuth(Home);
