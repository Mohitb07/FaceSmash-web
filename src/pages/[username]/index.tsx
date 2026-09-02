import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import FeedContainer from '@/common/FeedContainer';
import Navigation from '@/common/Navigation';
import ErrorFallback from '@/components/Error';
import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import { useGetUser } from '@/hooks/useGetUser';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';

import { db } from '../../../firebase';

const UserProfile = () => {
  const router = useRouter();
  const rawUsername = router.query.username as string | undefined;
  const queryUserId = router.query.userId as string | undefined;

  const [resolvedUserId, setResolvedUserId] = useState<string | null>(
    queryUserId || null
  );
  const [resolvingUser, setResolvingUser] = useState(!queryUserId);

  useEffect(() => {
    if (!router.isReady) return;

    if (queryUserId) {
      setResolvedUserId(queryUserId);
      setResolvingUser(false);
      return;
    }

    if (rawUsername) {
      const fetchUserByUsername = async () => {
        try {
          setResolvingUser(true);
          const q = query(
            collection(db, USERS_COLLECTION),
            where('qusername', '==', rawUsername.toLowerCase())
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            setResolvedUserId(snap.docs[0].id);
          } else {
            setResolvedUserId(null);
          }
        } catch (err) {
          console.error('Error resolving username', err);
          setResolvedUserId(null);
        } finally {
          setResolvingUser(false);
        }
      };
      fetchUserByUsername();
    }
  }, [router.isReady, queryUserId, rawUsername]);

  const activeUserId = resolvedUserId || queryUserId || '';
  const { userDetail, isUserDetailLoading } = useGetUser(activeUserId);

  const postQuery = useMemo(
    () =>
      activeUserId
        ? query(
            collection(db, POSTS_COLLECTION),
            where('uid', '==', activeUserId),
            orderBy('createdAt', 'desc')
          )
        : query(collection(db, POSTS_COLLECTION), limit(0)),
    [activeUserId]
  );

  const isProfileLoading = resolvingUser || isUserDetailLoading;

  return (
    <Main
      meta={
        <Meta
          title={`FaceSmash - Profile ${
            userDetail?.username || rawUsername || ''
          }`}
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="wrapper">
        <div className="nav-container">
          <Navigation />
        </div>
        <main className="feed-container">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedContainer
              customQuery={postQuery}
              user={userDetail}
              isLoading={isProfileLoading}
              userId={activeUserId}
              isProfile
            />
          </ErrorBoundary>
        </main>
        <aside className="recommendation-container" />
      </div>
    </Main>
  );
};

export default withAuth(UserProfile);
