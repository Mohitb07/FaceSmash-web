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
      <div className="grid h-screen grid-cols-1 overflow-hidden md:grid-cols-4 lg:grid-cols-4">
        <div className="h-full w-full overflow-y-auto">
          <Navigation />
        </div>
        <div className="overflow-y-auto md:col-span-3 lg:col-span-2">
          <header className="sticky top-0 z-50 bg-black text-center md:hidden">
            <Brand />
          </header>
          <main className="overflow-x-auto bg-red-500">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <FeedContainer customQuery={postQuery} />
            </ErrorBoundary>
          </main>
        </div>
        <aside className="hidden overflow-y-auto p-6 lg:block">
          <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <UserRecommendation />
            </ErrorBoundary>
          </SlideFade>
        </aside>
      </div>
    </Main>
  );
}

export default withAuth(Home);
