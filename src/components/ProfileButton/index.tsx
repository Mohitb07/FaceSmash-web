import { Button, useDisclosure } from '@chakra-ui/react';
import { doc, writeBatch } from 'firebase/firestore';
import { lazy, Suspense, useState } from 'react';

import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { ModalType } from '@/interface';

import { db } from '../../../firebase';
const UpdateProfileModal = lazy(
  () => import('@/components/UpdateProfileModal')
);

type ProfileButtonProps = {
  userId: string;
  hasFollowedThisUser: boolean;
};

const ProfileButton = ({ userId, hasFollowedThisUser }: ProfileButtonProps) => {
  const { authUser } = useAuthUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleConnections = () => {
    const batch = writeBatch(db);
    if (authUser) {
      const authUserFollowingDocRef = doc(
        db,
        `${USERS_COLLECTION}/${authUser.uid}/followings/${userId}`
      );
      const profileUserFollowerDocRef = doc(
        db,
        `${USERS_COLLECTION}/${userId}/followers/${authUser.uid}`
      );
      if (hasFollowedThisUser) {
        // unfollow
        batch.delete(authUserFollowingDocRef);
        batch.delete(profileUserFollowerDocRef);
      } else {
        // follow user
        batch.set(authUserFollowingDocRef, {
          user: doc(db, `/${USERS_COLLECTION}/${userId}`),
        });
        batch.set(profileUserFollowerDocRef, {
          user: doc(db, `/${USERS_COLLECTION}/${authUser.uid}`),
        });
      }
    }
    batch
      .commit()
      .catch((err) =>
        console.log('error while following/unfollowing user', err)
      );
  };

  const handleModalOpen = (type: ModalType) => {
    setModalType(type);
    onOpen();
  };

  return (
    <>
      <div className="hidden md:block">
        {authUser?.uid === userId ? (
          <Button
            colorScheme="brand"
            color="white"
            onClick={() => handleModalOpen('Edit profile')}
          >
            Edit profile
          </Button>
        ) : (
          <Button colorScheme="brand" color="white" onClick={handleConnections}>
            {hasFollowedThisUser ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>
      <Suspense fallback={<></>}>
        {isOpen && modalType === 'Edit profile' && (
          <UpdateProfileModal onClose={onClose} isOpen={isOpen} />
        )}
      </Suspense>
    </>
  );
};

export default ProfileButton;
