import {
  Flex,
  Modal,
  ModalBody,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import { lazy, Suspense, useState } from 'react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';

import BottomNavigation from '@/components/BottomNavigation';
import ErrorFallback from '@/components/Error';
import Sidebar from '@/components/SideNavigation';
import { useAuthUser } from '@/hooks/useAuthUser';

const PostModal = lazy(() => import('@/components/SideNavigation/PostModal'));
const SearchDrawer = lazy(
  () => import('@/components/SideNavigation/SearchDrawer')
);

const Navigation = () => {
  const { authUser, error } = useAuthUser();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useErrorHandler(error);
  const searchDrawerClose = () => {
    if (isSearchDrawerOpen) {
      setIsSearchDrawerOpen(false);
    }
  };

  const modalClose = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };
  return (
    <div className="md:h-screen">
      <div className="top-0 left-0 hidden md:fixed md:flex">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Sidebar
            user={authUser}
            setIsModalOpen={setIsModalOpen}
            setIsSearchDrawerOpen={setIsSearchDrawerOpen}
          />
        </ErrorBoundary>
      </div>{' '}
      <div className="md:hidden">
        <BottomNavigation
          user={authUser}
          setIsModalOpen={setIsModalOpen}
          setIsSearchDrawerOpen={setIsSearchDrawerOpen}
        />
      </div>
      <Suspense
        fallback={
          <Modal isCentered size="full" isOpen={true} onClose={() => {}}>
            <ModalOverlay />
            <ModalBody>
              <Flex justifyContent="center" alignItems="center">
                <Spinner />
              </Flex>
            </ModalBody>
          </Modal>
        }
      >
        {isSearchDrawerOpen && (
          <SearchDrawer
            isSearchDrawerOpen={isSearchDrawerOpen}
            searchDrawerClose={searchDrawerClose}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <Modal isCentered size="full" isOpen={true} onClose={() => {}}>
            <ModalOverlay />
            <ModalBody>
              <Flex justifyContent="center" alignItems="center">
                <Spinner />
              </Flex>
            </ModalBody>
          </Modal>
        }
      >
        {isModalOpen && (
          <PostModal
            mode="create"
            isModalOpen={isModalOpen}
            modalClose={modalClose}
          />
        )}
      </Suspense>
    </div>
  );
};
export default Navigation;
