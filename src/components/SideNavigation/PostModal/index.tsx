import {
  Box,
  Button,
  Flex,
  FormControl,
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
  useBoolean,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import React, { memo, useState } from 'react';
import Files from 'react-files';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';
import * as yup from 'yup';

import ErrorLabel from '@/components/ErrorLabel';
import Input from '@/components/Input';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { CustomFile } from '@/interface';

type PostModalProps = {
  isModalOpen: boolean;
  modalClose: () => void;
};

const PostImage = ({ selectedImage }: { selectedImage: string | null }) => {
  if (selectedImage) {
    return (
      <div className="flex items-center justify-center p-2">
        <Image
          src={selectedImage}
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

const schema = yup
  .object({
    title: yup
      .string()
      .max(30, 'Title must not exceed 30 characters')
      .required('Title is a required field'),
    description: yup
      .string()
      .max(100)
      .required('Description is a required field'),
    link: yup.string().optional(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;
type FileInput = {
  file: CustomFile | null;
  error: string;
  imageRef: string;
};

const CreatePostModal = ({
  isModalOpen = false,
  modalClose,
}: PostModalProps) => {
  const [fileInput, setFileInput] = useState<FileInput>({
    file: null,
    error: '',
    imageRef: '',
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      link: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useBoolean(false);
  const [isImageContainerVisible, setIsImageContainerVisible] =
    useBoolean(true);
  const { authUser } = useAuthUser();
  const { createPostWithImage, createPostWithoutImage } = useHandlePost();
  const { uploadImage } = useImageUpload();

  const handlePostCreation: SubmitHandler<FormData> = (data) => {
    try {
      setIsLoading(true);
      if (fileInput.file && authUser?.uid) {
        const urlRef = `${authUser.uid}/posts/${fileInput.imageRef}`;
        uploadImage(urlRef, fileInput.file, (url: string) => {
          createPostWithImage(
            authUser,
            url,
            { ...data, image: fileInput.file, imageRef: fileInput.imageRef },
            () => {
              modalClose();
              setIsLoading(false);
            }
          );
        });
      }
      if (!fileInput.file && authUser?.uid) {
        createPostWithoutImage(authUser, data, () => {
          modalClose();
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.log('Error', error);
      setIsLoading(false);
    }
  };

  const handleChange = (files: CustomFile[]) => {
    if (files.length > 0) {
      setFileInput({
        file: files[0],
        error: '',
        imageRef: `${files[0].name}${files[0].lastModified}`,
      });
    }
  };

  const handleError = (error: any) => {
    setFileInput((prev) => ({
      ...prev,
      error: error.message,
    }));
  };

  return (
    <Modal
      isCentered
      isOpen={isModalOpen || isLoading}
      onClose={modalClose}
      size="4xl"
    >
      <ModalOverlay />
      <form noValidate onSubmit={handleSubmit(handlePostCreation)}>
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl">Create new post</Text>
          </ModalHeader>
          <ModalCloseButton disabled={isLoading} />
          <ModalBody>
            <Box p={1}>
              <FormControl isRequired isInvalid={false}>
                <FormLabel>Title</FormLabel>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      isInvalid={!!errors.title?.message}
                      isDisabled={isLoading}
                      autoFocus
                      name="title"
                      placeholder="Enter title of your post"
                    />
                  )}
                />
                <ErrorLabel validationError={errors.title?.message} />
                {isLinkVisible && (
                  <div className="mt-5">
                    <FormLabel>Link</FormLabel>
                    <Controller
                      name="link"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          isDisabled={isLoading}
                          name="link"
                          type="url"
                          placeholder="Provide link"
                        />
                      )}
                    />
                    <ErrorLabel validationError={errors.link?.message} />
                  </div>
                )}
                <FormLabel mt={5}>Description</FormLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      disabled={isLoading}
                      name="description"
                      rounded="lg"
                      focusBorderColor="brand.100"
                      colorScheme="brand"
                      rows={10}
                      _placeholder={{ fontSize: 18 }}
                      placeholder="Enter description of your post"
                      size="md"
                    />
                  )}
                />
                <ErrorLabel validationError={errors.description?.message} />
                {isImageContainerVisible && (
                  <div className="mt-5 min-h-[5rem] overflow-hidden rounded-md border-2 border-dashed border-slate-600 px-3">
                    <Files
                      onChange={handleChange}
                      onError={handleError}
                      accepts={['image/*']}
                      maxFileSize={1000000}
                      minFileSize={0}
                      clickable
                    >
                      {!fileInput.file && (
                        <Text
                          textAlign="center"
                          mt={4}
                          color="GrayText"
                          fontSize="2xl"
                        >
                          Select Image from your system
                        </Text>
                      )}
                      <MemoizedPostImage
                        selectedImage={fileInput.file?.preview.url ?? null}
                      />
                    </Files>
                  </div>
                )}
                <ErrorLabel validationError={fileInput.error} />
              </FormControl>
              <Flex gap={3} mt={5}>
                <IconButton
                  onClick={setIsLinkVisible.toggle}
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
                  onClick={setIsImageContainerVisible.toggle}
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
              disabled={isLoading}
              type="submit"
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
      </form>
    </Modal>
  );
};
export default memo(CreatePostModal);
