import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { memo, useRef, useState } from 'react';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';

import Input from '@/components/Input';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import { useImageUpload } from '@/hooks/useImageUpload';
import { convertImageObject } from '@/utils/convertImageObject';

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

const PostImage = ({
  selectedImage,
}: {
  selectedImage: Blob | MediaSource;
}) => {
  if (selectedImage) {
    return (
      <div className="flex items-center justify-center p-2">
        <Image
          src={URL.createObjectURL(selectedImage)}
          height={300}
          width={600}
          alt="post image"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
    );
  } else {
    return null;
  }
};

const MemoizedPostImage = memo(PostImage);

const CreatePostModal = ({
  isModalOpen = false,
  modalClose,
}: PostModalProps) => {
  const [postData, setPostData] = useState<PostValue>({
    title: '',
    description: '',
    image: '',
    link: '',
    imageRef: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const [isImageContainerVisible, setIsImageContainerVisible] = useState(true);
  const { authUser } = useAuthUser();
  const { createPostWithImage, createPostWithoutImage } = useHandlePost();
  const { uploadImage } = useImageUpload();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePostValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = convertImageObject(e);
    if (file) {
      setPostData((prev) => ({
        ...prev,
        image: file,
        imageRef: `${file.name}${file.lastModified}`,
      }));
    }
  };

  const handlePostCreation = async () => {
    try {
      setIsLoading(true);
      if (postData.image && authUser?.uid) {
        const urlRef = `${authUser.uid}/posts/${postData.imageRef}`;
        uploadImage(urlRef, postData.image, (url: string) => {
          createPostWithImage(authUser, url, postData, () => {
            modalClose();
            setIsLoading(false);
          });
        });
      }
      if (!postData.image && authUser?.uid) {
        createPostWithoutImage(authUser, postData, () => {
          modalClose();
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.log('Error', error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isCentered
      isOpen={isModalOpen || isLoading}
      onClose={modalClose}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl">Create new post</Text>
        </ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody>
          <Box p={1}>
            <FormControl isRequired isInvalid={false}>
              <FormLabel>Title</FormLabel>
              <Input
                isDisabled={isLoading}
                autoFocus
                name="title"
                value={postData.title}
                placeholder="Enter title of your post"
                onChange={handlePostValueChange}
              />
              {isLinkVisible && (
                <div className="mt-5">
                  <FormLabel>Link</FormLabel>
                  <Input
                    isDisabled={isLoading}
                    name="link"
                    type="url"
                    value={postData.link}
                    placeholder="Provide link"
                    onChange={handlePostValueChange}
                  />
                </div>
              )}
              <FormErrorMessage>Your First name is invalid</FormErrorMessage>
              <FormLabel mt={5}>Description</FormLabel>
              <Textarea
                disabled={isLoading}
                name="description"
                rounded="lg"
                focusBorderColor="brand.100"
                colorScheme="brand"
                rows={10}
                _placeholder={{ fontSize: 18 }}
                value={postData.description}
                onChange={handlePostValueChange}
                placeholder="Enter description of your post"
                size="md"
              />
              {isImageContainerVisible && (
                <div
                  className="mt-5 min-h-[5rem] overflow-hidden rounded-md border-2 border-dashed border-slate-600 px-3"
                  onClick={() =>
                    imageInputRef.current && imageInputRef.current.click()
                  }
                >
                  {!postData.image && (
                    <Text
                      textAlign="center"
                      mt={4}
                      color="GrayText"
                      fontSize="2xl"
                    >
                      Select Image from your system
                    </Text>
                  )}
                  {postData.image ? (
                    <MemoizedPostImage selectedImage={postData.image} />
                  ) : null}
                  <Input
                    accept="image/*"
                    ref={imageInputRef}
                    hidden
                    isDisabled={isLoading}
                    name="image"
                    type="file"
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
            aria-label="Close modal"
            disabled={isLoading}
            color="white"
            colorScheme="ghost"
            mr={3}
            onClick={modalClose}
          >
            Cancel
          </Button>
          <Button
            aria-label="Create post"
            disabled={!postData.description || !postData.title}
            onClick={handlePostCreation}
            rounded="full"
            color="white"
            colorScheme="brand"
            variant="solid"
            isLoading={isLoading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default memo(CreatePostModal);
