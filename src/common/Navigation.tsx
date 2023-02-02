import {
  Flex,
  Modal,
  ModalBody,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import { lazy, Suspense, useState } from 'react';

import BottomNavigation from '@/components/BottomNavigation';
import Sidebar from '@/components/SideNavigation';
import { useAuthUser } from '@/hooks/useAuthUser';

const PostModal = lazy(() => import('@/components/SideNavigation/PostModal'));
const SearchDrawer = lazy(
  () => import('@/components/SideNavigation/SearchDrawer')
);

const Navigation = () => {
  const { authUser } = useAuthUser();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div>
      <div>
        <Sidebar
          user={authUser}
          setIsModalOpen={setIsModalOpen}
          setIsSearchDrawerOpen={setIsSearchDrawerOpen}
        />
      </div>
      <div>
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
          <PostModal isModalOpen={isModalOpen} modalClose={modalClose} />
        )}
      </Suspense>
    </div>
  );
};
export default Navigation;
