import React, { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
  Text,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';

type PostModalProps = {
  isModalOpen: boolean;
  modalClose: () => void;
};

const PostModal = ({ isModalOpen = false, modalClose }: PostModalProps) => {
  const [postValue, setPostValue] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);

  const handlePostValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostCreation = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('sending', postValue);
      setLoading(false);
    }, 2000);
  };

  return (
    <Modal
      isCentered
      isOpen={isModalOpen || loading}
      onClose={modalClose}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl">Create new post</Text>
        </ModalHeader>
        <ModalCloseButton disabled={loading} />
        <ModalBody>
          <Box p={1}>
            <FormControl isRequired isInvalid={false}>
              <FormLabel>Title</FormLabel>
              <Input
                disabled={loading}
                autoFocus
                name="title"
                focusBorderColor="brand.100"
                rounded="lg"
                value={postValue.title}
                placeholder="Enter title of your post"
                onChange={handlePostValueChange}
              />
              {isLinkVisible && (
                <div className='mt-5'>
                  <FormLabel>Link</FormLabel>
                  <Input
                    disabled={loading}
                    name="title"
                    type="url"
                    focusBorderColor="brand.100"
                    rounded="lg"
                    value={postValue.title}
                    placeholder="Provide link"
                    onChange={handlePostValueChange}
                  />
                </div>
              )}
              <FormErrorMessage>Your First name is invalid</FormErrorMessage>
              <FormLabel mt={5}>Description</FormLabel>
              <Textarea
                disabled={loading}
                name="description"
                rounded="lg"
                focusBorderColor="brand.100"
                colorScheme="brand"
                rows={10}
                _placeholder={{ fontSize: 18 }}
                value={postValue.description}
                onChange={handlePostValueChange}
                placeholder="Enter description of your post"
                size="sm"
              />
            </FormControl>
            <Flex gap={3} mt={5}>
              <IconButton
                onClick={() => setIsLinkVisible(s => !s)}
                colorScheme={`${isLinkVisible ? 'gray' : 'blue'}`}
                aria-label="Add link"
                icon={isLinkVisible ? <BiUnlink className="text-xl"/> :  <BiLink className="text-xl" />}
              />
              <IconButton
                colorScheme="teal"
                aria-label="Add photo"
                icon={<BsImages />}
              />
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading}
            color="white"
            colorScheme="ghost"
            mr={3}
            onClick={modalClose}
          >
            Cancel
          </Button>
          <Button
            disabled={!postValue.description || !postValue.title}
            onClick={handlePostCreation}
            rounded="full"
            color="white"
            colorScheme="brand"
            variant="solid"
            isLoading={loading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default PostModal;
