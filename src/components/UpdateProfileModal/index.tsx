import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import React, { memo, useRef, useState } from 'react';

import { DEFAULT_PROFILE_PIC, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useImageUpload } from '@/hooks/useImageUpload';
import { convertImageObject } from '@/utils/convertImageObject';

import { db } from '../../../firebase';

type UpdateProfileModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

type UpdateProfileData = {
  selectedImage: Blob | MediaSource | '';
  bio: string;
};

type ProfilePicProps = {
  username: string;
  selectedImage?: Blob | MediaSource;
  defaultImage?: string;
};

const ProfilePic = ({
  username,
  selectedImage,
  defaultImage,
}: ProfilePicProps) => {
  if (selectedImage) {
    return (
      <Avatar
        onError={() => console.log('image error')}
        loading="lazy"
        ignoreFallback
        size="2xl"
        name={username}
        src={URL.createObjectURL(selectedImage)}
      />
    );
  } else {
    return (
      <Avatar
        onError={() => console.log('image error')}
        loading="lazy"
        ignoreFallback
        size="2xl"
        name={username}
        src={defaultImage}
      />
    );
  }
};

const MemoizedProfile = memo(ProfilePic);

const UpdateProfileModal = ({ onClose, isOpen }: UpdateProfileModalProps) => {
  const { authUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [updateProfileFieldData, setUpdateProfileFieldData] =
    useState<UpdateProfileData>({
      selectedImage: '',
      bio: authUser?.bio || '',
    });
  const { uploadImage } = useImageUpload();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUpdateProfileFieldData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = convertImageObject(e);
    if (file) {
      setUpdateProfileFieldData((prev) => ({
        ...prev,
        selectedImage: file,
      }));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      if (updateProfileFieldData.selectedImage && authUser) {
        const urlRef = `${authUser.uid}/profilePic/`;
        uploadImage(
          urlRef,
          updateProfileFieldData.selectedImage,
          async (url: string) => {
            await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), {
              profilePic: url,
            });
          }
        );
      }
      if (updateProfileFieldData.bio && authUser) {
        await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), {
          bio: updateProfileFieldData.bio,
        });
      }
    } catch (error) {
      console.log('upload error', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const isDisabled =
    !updateProfileFieldData.bio ||
    (updateProfileFieldData.bio === authUser?.bio &&
      !updateProfileFieldData.selectedImage);

  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl">Edit Profile</Text>
        </ModalHeader>
        <ModalCloseButton disabled={loading} />
        <ModalBody>
          <Box p={1}>
            <FormControl isInvalid={false}>
              <FormLabel mt={5}>Change profile pic</FormLabel>
              <div className="flex justify-center overflow-hidden px-3">
                <div
                  className="inline-block cursor-pointer"
                  onClick={() =>
                    imageInputRef.current && imageInputRef.current.click()
                  }
                >
                  {updateProfileFieldData.selectedImage ? (
                    <MemoizedProfile
                      username={authUser?.username || ''}
                      selectedImage={updateProfileFieldData.selectedImage}
                    />
                  ) : (
                    <MemoizedProfile
                      username={authUser?.username || ''}
                      defaultImage={authUser?.profilePic || DEFAULT_PROFILE_PIC}
                    />
                  )}
                  <Input
                    ref={imageInputRef}
                    hidden
                    disabled={loading}
                    name="image"
                    type="file"
                    focusBorderColor="brand.100"
                    rounded="lg"
                    onChange={handleImageProcessing}
                  />
                </div>
              </div>
              <FormLabel>Change your Bio</FormLabel>
              <Input
                disabled={loading}
                autoFocus
                name="bio"
                focusBorderColor="brand.100"
                rounded="lg"
                placeholder="Your bio"
                value={updateProfileFieldData.bio}
                onChange={onChangeHandler}
              />
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading}
            color="white"
            colorScheme="ghost"
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={isDisabled}
            onClick={handleProfileUpdate}
            rounded="full"
            color="white"
            colorScheme="brand"
            variant="solid"
            isLoading={loading}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default UpdateProfileModal;
