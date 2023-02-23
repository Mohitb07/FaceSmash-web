import { SlideFade } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';

import FeedContainer from '@/common/FeedContainer';
import Navigation from '@/common/Navigation';
import Brand from '@/components/Brand';
import ErrorFallback from '@/components/Error';
import UserRecommendation from '@/components/UserRecommendation';
import { useGetPosts } from '@/hooks/useGetPosts';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';

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
      <div>
        <Navigation />
      </div>
      <div>
        <div>
          <header className="block text-center md:hidden">
            <Brand />
          </header>
          <div className="flex justify-center gap-10 md:p-10">
            <main className="w-auto space-y-5 pb-16 md:ml-[20%] xl:ml-[10%]">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <FeedContainer />
              </ErrorBoundary>
            </main>
            <aside className="hidden flex-col lg:flex">
              <SlideFade in={postsLoading || !postsLoading} offsetY="20px">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <UserRecommendation />
                </ErrorBoundary>
              </SlideFade>
            </aside>
          </div>
        </div>
      </div>
    </Main>
  );
}

export default withAuth(Home);
