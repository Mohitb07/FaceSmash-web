import React, { useRef, useState, memo } from 'react';

import Image from 'next/image';
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

import { useAuthUser } from '../../../hooks/useAuthUser';
import { useCreatePost } from '../../../hooks/useCreatePost';
import { useImageUpload } from '../../../hooks/useImageUpload';

type PostModalProps = {
  isModalOpen: boolean;
  modalClose: () => void;
};

export type PostValue = {
  title: string;
  description: string;
  image: Blob | MediaSource | '';
  link: string;
  imageRef: string;
};

const PostModal = ({ isModalOpen = false, modalClose }: PostModalProps) => {
  const [postValue, setPostValue] = useState<PostValue>({
    title: '',
    description: '',
    image: '',
    link: '',
    imageRef: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const [isImageContainerVisible, setIsImageContainerVisible] = useState(true);
  const { authUser } = useAuthUser();
  const { createPostWithImage, createPostWithoutImage } = useCreatePost();
  const { uploadImage } = useImageUpload();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePostValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setPostValue((prev) => ({
      ...prev,
      image: file,
      imageRef: `${file.name}${file.lastModified}`,
    }));
  };

  const handlePostCreation = async () => {
    try {
      setLoading(true);
      if (postValue.image && authUser?.uid) {
        const urlRef = `${authUser.uid}/posts/${postValue.imageRef}`;
        uploadImage(urlRef, postValue.image, (url: string) => {
          createPostWithImage(authUser, url, postValue, () => {
            modalClose();
            setLoading(false);
          });
        });
      }
      if (!postValue.image && authUser?.uid) {
        createPostWithoutImage(authUser, postValue, () => {
          modalClose();
          setLoading(false);
        });
      }
    } catch (error) {
      console.log('Error', error);
      setLoading(false);
    }
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
                <div className="mt-5">
                  <FormLabel>Link</FormLabel>
                  <Input
                    disabled={loading}
                    name="link"
                    type="url"
                    focusBorderColor="brand.100"
                    rounded="lg"
                    value={postValue.link}
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
                size="md"
              />
              {isImageContainerVisible && (
                <div
                  className="mt-5 border-2 border-dashed border-slate-600 rounded-md overflow-hidden min-h-[5rem] px-3"
                  onClick={() =>
                    imageInputRef.current && imageInputRef.current.click()
                  }
                >
                  {!postValue.image && (
                    <Text
                      textAlign="center"
                      mt={4}
                      color="GrayText"
                      fontSize="2xl"
                    >
                      Select Image from your system
                    </Text>
                  )}
                  {postValue.image && (
                    <div className="flex justify-center items-center p-2">
                      <Image
                        src={URL.createObjectURL(postValue.image)}
                        height={300}
                        width={600}
                        alt="post image"
                        objectFit="cover"
                        className="rounded-2xl"
                      />
                    </div>
                  )}
                  <Input
                    accept="image/*"
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
              )}
            </FormControl>
            <Flex gap={3} mt={5}>
              <IconButton
                onClick={() => setIsLinkVisible((s) => !s)}
                colorScheme={`${isLinkVisible ? 'gray' : 'blue'}`}
                aria-label="Add link"
                icon={
                  isLinkVisible ? (
                    <BiUnlink className="text-xl" />
                  ) : (
                    <BiLink className="text-xl" />
                  )
                }
              />
              <IconButton
                onClick={() => setIsImageContainerVisible((s) => !s)}
                colorScheme={`${isImageContainerVisible ? 'gray' : 'teal'}`}
                aria-label="Add photo"
                icon={
                  isImageContainerVisible ? (
                    <BsImages className="text-xl" />
                  ) : (
                    <BsImages className="text-xl" />
                  )
                }
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
export default memo(PostModal);
