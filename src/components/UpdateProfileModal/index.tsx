import React, { useRef, useState } from 'react';

import {
  Avatar,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button as Btn,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import { convertImageObject } from '../../utils/convertImageObject';
import { DEFAULT_PROFILE_PIC } from '../../constant';
import { useAuthUser } from '../../hooks/useAuthUser';

type UpdateProfileModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const UpdateProfileModal = ({ onClose, isOpen }: UpdateProfileModalProps) => {
  const { authUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [updateProfileFieldData, setUpdateProfileFieldData] = useState({
    selectedImage: '',
    bio: authUser?.bio || '',
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateProfileFieldData((prev) => ({
      ...prev,
      selectedImage: convertImageObject(e),
    }));
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('data', updateProfileFieldData);
      setLoading(false);
      setUpdateProfileFieldData({
        selectedImage: '',
        bio: authUser?.bio || '',
      });
      onClose();
    }, 2000);
  };

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
              <div className="overflow-hidden px-3 flex justify-center">
                <div
                  className="cursor-pointer inline-block"
                  onClick={() =>
                    imageInputRef.current && imageInputRef.current.click()
                  }
                >
                  <Avatar
                    size="2xl"
                    name={authUser?.username}
                    src={
                      updateProfileFieldData.selectedImage ||
                      authUser?.profilePic ||
                      DEFAULT_PROFILE_PIC
                    }
                  />
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
                onChange={(e) =>
                  setUpdateProfileFieldData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
              />
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Btn
            disabled={loading}
            color="white"
            colorScheme="ghost"
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Btn>
          <Btn
            disabled={!updateProfileFieldData.bio}
            onClick={handleProfileUpdate}
            rounded="full"
            color="white"
            colorScheme="brand"
            variant="solid"
            isLoading={loading}
          >
            Update
          </Btn>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default UpdateProfileModal;
