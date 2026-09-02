import {
  Avatar,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import Files from 'react-files';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { BiImageAdd, BiLink, BiTrash, BiX } from 'react-icons/bi';
import { FiGlobe, FiSend } from 'react-icons/fi';
import * as yup from 'yup';

import ErrorLabel from '@/components/ErrorLabel';
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
      .max(40, 'Title must not exceed 40 characters')
      .required('Title is required'),
    description: yup
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .required('Description is required'),
    link: yup.string().url('Please enter a valid URL').optional(),
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
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialFormData?.title || '',
      description: initialFormData?.description || '',
      link: initialFormData?.link || '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(
    Boolean(initialFormData?.link)
  );
  const [removeInitialImage, setRemoveInitialImage] = useState(false);
  const { createPostWithImage, createPostWithoutImage, updatePost } =
    useHandlePost();
  const { uploadImage, progress } = useImageUpload();
  const toast = useToast();

  const titleValue = watch('title') || '';
  const descriptionValue = watch('description') || '';

  // Sync initial form data on open/edit
  useEffect(() => {
    if (isModalOpen) {
      reset({
        title: initialFormData?.title || '',
        description: initialFormData?.description || '',
        link: initialFormData?.link || '',
      });
      setIsLinkVisible(Boolean(initialFormData?.link));
      setRemoveInitialImage(false);
      setFileInput({
        file: null,
        error: '',
        imageRef: '',
      });
    }
  }, [isModalOpen, initialFormData, reset]);

  const activeImage =
    fileInput.file?.preview.url ||
    (!removeInitialImage ? initialFormData?.image : null);

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
        }).catch((err: any) => {
          console.error('Image upload failed', err);
          setIsLoading(false);
          toast({
            title: 'Image Upload Failed',
            description:
              err?.message || 'Failed to upload image. Please try again.',
            status: 'error',
            duration: 6000,
            isClosable: true,
            position: 'bottom-right',
          });
        });
      }

      if (!fileInput.file && authUser?.uid) {
        createPostWithoutImage(authUser, data, () => {
          modalClose();
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Error during post creation', error);
      setIsLoading(false);
    }
  };

  const handlePostEdit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      if (fileInput.file && authUser?.uid && postId) {
        const urlRef = `${authUser.uid}/posts/${fileInput.imageRef}`;
        uploadImage(urlRef, fileInput.file, (url: string) => {
          updatePost(
            postId,
            url,
            {
              ...data,
              link: data.link,
              imageRef: fileInput.imageRef,
            },
            () => {
              modalClose();
              setIsLoading(false);
            }
          );
        }).catch((err: any) => {
          console.error('Image upload failed', err);
          setIsLoading(false);
          toast({
            title: 'Image Upload Failed',
            description:
              err?.message || 'Failed to upload image. Please try again.',
            status: 'error',
            duration: 6000,
            isClosable: true,
            position: 'bottom-right',
          });
        });
      }

      if (!fileInput.file && authUser?.uid && postId) {
        updatePost(
          postId,
          removeInitialImage ? '' : initialFormData?.image || '',
          {
            ...data,
            link: data.link,
            imageRef: removeInitialImage ? '' : imageRef,
          },
          () => {
            modalClose();
            setIsLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Error during post edit', error);
      setIsLoading(false);
    }
  };

  const handleChange = (files: CustomFile[]) => {
    if (files.length > 0) {
      setFileInput({
        file: files[0],
        error: '',
        imageRef: `${files[0].name}_${Date.now()}`,
      });
      setRemoveInitialImage(false);
    }
  };

  const handleError = (error: any) => {
    setFileInput((prev) => ({
      ...prev,
      error: error.message,
    }));
  };

  const removeSelectedImage = () => {
    setFileInput({
      file: null,
      error: '',
      imageRef: '',
    });
    setRemoveInitialImage(true);
  };

  const isFormValid =
    titleValue.trim().length > 0 &&
    descriptionValue.trim().length > 0 &&
    !isLoading;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={modalClose}
      isCentered
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent
        bg="#131518"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius={{ base: '2xl', sm: '3xl' }}
        shadow="2xl"
        color="white"
        overflow="hidden"
        my={{ base: 4, sm: 8 }}
        mx={{ base: 3, sm: 'auto' }}
      >
        {/* Upload Progress Bar (if uploading) */}
        {isLoading && progress > 0 && (
          <Progress
            value={progress}
            size="xs"
            colorScheme="purple"
            hasStripe
            isAnimated
          />
        )}

        <form
          noValidate
          onSubmit={
            mode === 'create'
              ? handleSubmit(handlePostCreation)
              : handleSubmit(handlePostEdit)
          }
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                {mode === 'create' ? 'Create a Post' : 'Edit Post'}
              </span>
            </div>
            <ModalCloseButton
              position="static"
              color="zinc.400"
              _hover={{ color: 'white', bg: 'zinc.800' }}
              rounded="full"
            />
          </div>

          <ModalBody p={0}>
            <div className="space-y-4 px-5 py-4 sm:px-6">
              {/* User Profile Header Line */}
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  name={authUser?.username || 'You'}
                  src={authUser?.profilePic}
                  className="ring-2 ring-purple-500/30"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">
                      {authUser?.username || 'You'}
                    </span>
                    <span className="text-xs text-zinc-500">
                      @{authUser?.qusername || 'user'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <FiGlobe className="text-xs" />
                    <span>Public to Feed</span>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="relative">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled={isLoading}
                      autoFocus
                      placeholder="What is the title of your post?"
                      maxLength={40}
                      className="w-full bg-transparent text-base font-semibold text-white outline-none transition-all placeholder:text-zinc-500 sm:text-lg"
                    />
                  )}
                />
                <div className="mt-0.5 flex items-center justify-between text-[11px] text-zinc-500">
                  <ErrorLabel validationError={errors.title?.message} />
                  <span
                    className={
                      titleValue.length >= 35 ? 'font-bold text-amber-400' : ''
                    }
                  >
                    {titleValue.length}/40
                  </span>
                </div>
              </div>

              {/* Description / Caption Auto-Resizing Textarea */}
              <div className="relative">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      disabled={isLoading}
                      rows={4}
                      placeholder="Write your thoughts, ideas, or caption here..."
                      maxLength={1000}
                      className="w-full resize-none bg-transparent text-sm leading-relaxed text-zinc-200 outline-none transition-all placeholder:text-zinc-600"
                    />
                  )}
                />
                <div className="mt-0.5 flex items-center justify-between text-[11px] text-zinc-500">
                  <ErrorLabel validationError={errors.description?.message} />
                  <span
                    className={
                      descriptionValue.length >= 900
                        ? 'font-bold text-amber-400'
                        : ''
                    }
                  >
                    {descriptionValue.length}/1000
                  </span>
                </div>
              </div>

              {/* Optional Link Input */}
              {isLinkVisible && (
                <div className="rounded-2xl border border-zinc-800 bg-[#0c1014] p-3 transition-all">
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                      <BiLink className="text-sm text-purple-400" />
                      <span>Attached Link</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLinkVisible(false);
                        reset({ ...watch(), link: '' });
                      }}
                      className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                      title="Remove link"
                    >
                      <BiX className="text-base" />
                    </button>
                  </div>
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={isLoading}
                        type="url"
                        placeholder="https://example.com"
                        className="w-full bg-transparent text-xs text-purple-300 outline-none placeholder:text-zinc-600"
                      />
                    )}
                  />
                  <ErrorLabel validationError={errors.link?.message} />
                </div>
              )}

              {/* Image Preview & Upload Container */}
              {activeImage ? (
                <div className="group relative max-h-[360px] w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0C1014]">
                  <Image
                    src={activeImage}
                    alt="Post media preview"
                    height={360}
                    width={600}
                    objectFit="cover"
                    className="w-full object-cover transition-all"
                  />
                  {/* Floating Remove Button */}
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    disabled={isLoading}
                    aria-label="Remove image"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-all hover:bg-red-600 active:scale-95"
                  >
                    <BiTrash className="text-base" />
                  </button>
                </div>
              ) : (
                <Files
                  onChange={handleChange}
                  onError={handleError}
                  accepts={['image/*']}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable
                >
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-[#0c1014]/60 p-5 transition-all hover:border-purple-500/50 hover:bg-[#16181c]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <BiImageAdd className="text-2xl" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-zinc-300">
                      Add a photo to your post
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      PNG, JPG, WEBP or GIF up to 10MB
                    </span>
                  </div>
                </Files>
              )}
              <ErrorLabel validationError={fileInput.error} />
            </div>
          </ModalBody>

          {/* Modal Footer & Action Toolbar */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#0c1014]/80 px-5 py-3.5 sm:px-6">
            {/* Quick Action Icons */}
            <div className="flex items-center gap-1.5">
              <Files
                onChange={handleChange}
                onError={handleError}
                accepts={['image/*']}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                <IconButton
                  aria-label="Attach Photo"
                  icon={<BiImageAdd className="text-xl text-purple-400" />}
                  size="sm"
                  variant="ghost"
                  rounded="xl"
                  _hover={{ bg: 'purple.500/10', color: 'purple.300' }}
                  disabled={isLoading}
                />
              </Files>

              <IconButton
                aria-label="Add Link"
                onClick={() => setIsLinkVisible((prev) => !prev)}
                icon={
                  <BiLink
                    className={`text-xl ${
                      isLinkVisible ? 'text-purple-400' : 'text-zinc-400'
                    }`}
                  />
                }
                size="sm"
                variant="ghost"
                rounded="xl"
                _hover={{ bg: 'purple.500/10' }}
                disabled={isLoading}
              />
            </div>

            {/* Actions: Cancel & Post */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={modalClose}
                disabled={isLoading}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 transition-all hover:bg-zinc-800/80 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <span>
                    {progress > 0 && progress < 100
                      ? `Uploading ${progress}%`
                      : mode === 'create'
                      ? 'Publishing...'
                      : 'Saving...'}
                  </span>
                ) : (
                  <>
                    <span>{mode === 'create' ? 'Post' : 'Save Changes'}</span>
                    <FiSend className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default memo(CreatePostModal);
