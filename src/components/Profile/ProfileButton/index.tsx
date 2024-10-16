import { Button, useDisclosure } from '@chakra-ui/react';
import { doc, writeBatch } from 'firebase/firestore';
import { lazy, Suspense, useMemo, useState } from 'react';

import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useConnection } from '@/hooks/useConnection';
import type { ModalType } from '@/interface';

import { db } from '../../../../firebase';
const UpdateProfileModal = lazy(
  () => import('@/components/UpdateProfileModal')
);

type ProfileButtonProps = {
  userId: string;
};

const ProfileButton = ({ userId }: ProfileButtonProps) => {
  const { authUser } = useAuthUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<ModalType>(null);
  const { followersList } = useConnection(userId);

  const hasFollowedThisUser = useMemo(
    () => !!followersList.find((user) => user.uid === authUser?.uid),
    [authUser?.uid, followersList]
  );

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
      <div className="">
        {authUser?.uid === userId ? (
          <Button
            width="fit-content"
            colorScheme="brand"
            color="white"
            rounded="full"
            minWidth={40}
            onClick={() => handleModalOpen('Edit profile')}
          >
            Edit
          </Button>
        ) : (
          <Button
            rounded="full"
            width="full"
            colorScheme="brand"
            color="white"
            minWidth={40}
            onClick={handleConnections}
          >
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
