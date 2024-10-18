import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Text,
  Textarea,
  useMediaQuery,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import Image from 'next/image';
import { memo, useState } from 'react';
import Files from 'react-files';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';
import * as yup from 'yup';

import ErrorLabel from '@/components/ErrorLabel';
import FormModal from '@/components/FormModal';
import Input from '@/components/Input';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { CustomFile } from '@/interface';

type PostModalProps = {
  isModalOpen: boolean;
  modalClose: () => void;
  mode: 'create' | 'edit';
  initialFormData?: {
    title: string;
    description: string;
    link?: string;
    image?: string;
  };
  postId?: string;
  imageRef?: string;
};

const schema = yup
  .object({
    title: yup
      .string()
      .max(30, 'Title must not exceed 30 characters')
      .required('Title is a required field'),
    description: yup
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
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
  mode,
  initialFormData,
  postId,
  imageRef,
}: PostModalProps) => {
  console.log('initialFormData', initialFormData);
  const { authUser } = useAuthUser();
  const [fileInput, setFileInput] = useState<FileInput>({
    file: null,
    error: '',
    imageRef: '',
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialFormData?.title,
      description: initialFormData?.description,
      link: initialFormData?.link,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(
    initialFormData?.link ? true : false
  );
  const [removeInitialImage, setRemoveInitialImage] = useState(false);
  const [removeInitialLink, setRemoveInitialLink] = useState(false);
  const [isImageContainerVisible, setIsImageContainerVisible] = useState(true);
  const [isMobile] = useMediaQuery('(max-width: 400px)');
  const [isMedium] = useMediaQuery('(max-width: 768px)');
  const [isLarge] = useMediaQuery('(max-width: 1024px)');
  const { createPostWithImage, createPostWithoutImage, updatePost } =
    useHandlePost();
  const { uploadImage } = useImageUpload();
  const values = watch();
  const currentValues = {
    ...values,
    link: !isLinkVisible && removeInitialLink ? '' : values.link,
    image:
      !isImageContainerVisible && removeInitialImage
        ? ''
        : fileInput.file?.preview.url || initialFormData?.image,
  };

  console.log('current', currentValues);

  const isDisabled =
    JSON.stringify(currentValues) === JSON.stringify(initialFormData);

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

  const handlePostEdit: SubmitHandler<FormData> = async (data) => {
    console.log('handlePostEdit', data);
    try {
      setIsLoading(true);
      if (fileInput.file && authUser?.uid && postId) {
        if (imageRef) {
          console.log('image ref', imageRef);
          const storage = getStorage();
          const storageImageRef = ref(
            storage,
            `${authUser?.uid}/posts/${imageRef}`
          );
          await deleteObject(storageImageRef);
        }
        const urlRef = `${authUser.uid}/posts/${fileInput.imageRef}`;
        uploadImage(urlRef, fileInput.file, (url: string) => {
          updatePost(
            postId,
            url,
            {
              ...data,
              link: currentValues.link,
              imageRef: fileInput.imageRef,
            },
            () => {
              modalClose();
              setIsLoading(false);
            }
          );
        });
      }
      if (!fileInput.file && authUser?.uid && postId) {
        updatePost(
          postId,
          removeInitialImage ? '' : initialFormData?.image || '',
          { ...data, link: currentValues.link },
          () => {
            modalClose();
            setIsLoading(false);
          }
        );
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

  const toggleImageContainer = () => {
    setIsImageContainerVisible((prevState) => !prevState);
    if (isImageContainerVisible) {
      setRemoveInitialImage(true);
      setFileInput({
        file: null,
        error: '',
        imageRef: '',
      });
    } else {
      setRemoveInitialImage(false);
    }
  };

  const toggleLinkContainer = () => {
    setIsLinkVisible((prevState) => !prevState);
    if (isLinkVisible) {
      setRemoveInitialLink(true);
    } else {
      setRemoveInitialLink(false);
    }
  };

  return (
    <FormModal
      isDisabled={mode === 'edit' ? isDisabled : false}
      title={mode === 'create' ? 'Create Post' : 'Edit Post'}
      isOpen={isModalOpen}
      onClose={modalClose}
      footerBtnLabel={mode === 'create' ? 'Create' : 'Edit'}
      onSubmit={
        mode === 'create'
          ? handleSubmit(handlePostCreation)
          : handleSubmit(handlePostEdit)
      }
      isLoading={isLoading}
    >
      <FormControl isRequired isInvalid={false}>
        <FormLabel
          fontSize={
            isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : 'large'
          }
        >
          Title
        </FormLabel>
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
              _placeholder={{ fontSize: isMobile ? 14 : 16 }}
            />
          )}
        />
        <ErrorLabel validationError={errors.title?.message} />
        {isLinkVisible && (
          <div className="mt-5">
            <FormLabel
              fontSize={
                isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : 'large'
              }
            >
              Link
            </FormLabel>
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
                  _placeholder={{ fontSize: isMobile ? 14 : 16 }}
                />
              )}
            />
            <ErrorLabel validationError={errors.link?.message} />
          </div>
        )}
        <FormLabel
          mt={5}
          fontSize={
            isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : 'large'
          }
        >
          Description
        </FormLabel>
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
              rows={isMobile ? 3 : isMedium ? 4 : isLarge ? 5 : 6}
              _placeholder={{ fontSize: isMobile ? 14 : 16 }}
              placeholder="Enter description of your post"
              size="md"
            />
          )}
        />
        <ErrorLabel validationError={errors.description?.message} />
        {isImageContainerVisible && (
          <div className="mt-5 overflow-hidden rounded-md border-2 border-dashed border-slate-600 p-1">
            <Files
              onChange={handleChange}
              onError={handleError}
              accepts={['image/*']}
              maxFileSize={1000000}
              minFileSize={0}
              clickable
            >
              {!initialFormData?.image && !fileInput.file && (
                <Text
                  textAlign="center"
                  p={3}
                  color="GrayText"
                  fontSize={
                    isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : '2xl'
                  }
                >
                  Select Image from your system
                </Text>
              )}
              {(Boolean(initialFormData?.image) || Boolean(fileInput.file)) && (
                <div className="flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      fileInput.file?.preview.url ||
                      initialFormData?.image ||
                      ''
                    }
                    height={300}
                    width={600}
                    alt="post image"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
            </Files>
          </div>
        )}
        <ErrorLabel validationError={fileInput.error} />
      </FormControl>
      <Flex gap={3} mt={5}>
        <IconButton
          onClick={toggleLinkContainer}
          colorScheme={`${isLinkVisible ? 'gray' : 'blue'}`}
          aria-label="Add a link"
          icon={
            isLinkVisible ? (
              <BiUnlink className="text-xl" />
            ) : (
              <BiLink className="text-xl" />
            )
          }
        />
        <IconButton
          onClick={toggleImageContainer}
          colorScheme={`${isImageContainerVisible ? 'gray' : 'teal'}`}
          aria-label="Add an image"
          icon={
            isImageContainerVisible ? (
              <BsImages className="text-xl" />
            ) : (
              <BsImages className="text-xl" />
            )
          }
        />
      </Flex>
    </FormModal>
  );
};
export default memo(CreatePostModal);
