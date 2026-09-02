import { useDisclosure } from '@chakra-ui/react';
import { doc, writeBatch } from 'firebase/firestore';
import { lazy, Suspense, useMemo, useState } from 'react';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { LiaEdit } from 'react-icons/lia';

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
      <div className="shrink-0">
        {authUser?.uid === userId ? (
          <button
            onClick={() => handleModalOpen('Edit profile')}
            className="flex h-9 w-[124px] items-center justify-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-800/80 text-sm font-semibold text-zinc-100 shadow-sm transition-all duration-200 hover:border-purple-500/50 hover:bg-zinc-700/80 hover:text-white active:scale-[0.98]"
          >
            <LiaEdit className="shrink-0 text-base text-purple-400" />
            <span>Edit profile</span>
          </button>
        ) : (
          <button
            onClick={handleConnections}
            className={`flex h-9 w-[124px] items-center justify-center gap-1 rounded-full border text-sm font-semibold shadow-md transition-all duration-200 active:scale-[0.98] ${
              hasFollowedThisUser
                ? 'border-zinc-700/80 bg-zinc-800/90 text-zinc-300 hover:border-red-400 hover:bg-red-500/10 hover:text-red-400'
                : 'border-purple-500/40 bg-purple-600 text-white shadow-purple-600/30 hover:bg-purple-700'
            }`}
          >
            {hasFollowedThisUser ? (
              <>
                <FiCheck className="shrink-0 text-base text-purple-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <FiPlus className="shrink-0 text-base" />
                <span>Follow</span>
              </>
            )}
          </button>
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
