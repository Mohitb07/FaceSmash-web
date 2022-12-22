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
  FormErrorMessage,
} from '@chakra-ui/react';

type UpdateProfileModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const UpdateProfileModal = ({ onClose, isOpen }: UpdateProfileModalProps) => {
    console.log('loaded')
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [bio, setBio] = useState('Mohit Bisht');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files![0]));
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('data', bio);
      setLoading(false);
      setSelectedImage('');
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
                    name="Prosper Otemuyiwa"
                    src={
                      selectedImage ||
                      'http://projects.websetters.in/digg-seos/digg/wp-content/themes/twentytwenty-child-theme/img/demo-prof.jpg'
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
                name="title"
                focusBorderColor="brand.100"
                rounded="lg"
                placeholder="Your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <FormErrorMessage>Your First name is invalid</FormErrorMessage>
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
            disabled={!bio}
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
