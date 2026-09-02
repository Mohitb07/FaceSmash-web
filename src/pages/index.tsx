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
          title="faceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      {/* Brand name on top on smaller screens */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-zinc-800/80 bg-[#0C1014]/90 text-center backdrop-blur-md md:hidden">
        <Brand />
      </header>
      <div className="wrapper">
        <div className="nav-container">
          <Navigation />
        </div>
        <main className="feed-container">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedContainer customQuery={postQuery} />
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
}

export default withAuth(Home);
