import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, updateDoc } from 'firebase/firestore';
import React, { memo, useState } from 'react';
import Files from 'react-files';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form/dist/types';
import * as yup from 'yup';

import Input from '@/components/Input';
import { DEFAULT_PROFILE_PIC, USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { CustomFile } from '@/interface';

import { db } from '../../../firebase';
import ErrorLabel from '../ErrorLabel';

type UpdateProfileModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

type ProfilePicProps = {
  username: string;
  selectedImage?: string;
  defaultImage?: string;
};

const ProfilePic = ({
  username,
  selectedImage,
  defaultImage,
}: ProfilePicProps) => (
  <Avatar
    _hover={{ opacity: 0.5 }}
    onError={() => console.log('image error')}
    loading="lazy"
    ignoreFallback
    size="2xl"
    name={username}
    src={selectedImage ?? defaultImage}
  />
);

const MemoizedProfile = memo(ProfilePic);

const schema = yup.object({
  bio: yup.string().max(30, 'Bio cannot exceed 30 characters'),
});

type FormData = yup.InferType<typeof schema>;

type FileInput = {
  file: CustomFile | null;
  error: string;
};

const UpdateProfileModal = ({ onClose, isOpen }: UpdateProfileModalProps) => {
  const { authUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [fileInput, setFileInput] = useState<FileInput>({
    file: null,
    error: '',
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      bio: authUser?.bio || '',
    },
  });
  const bio = watch('bio');
  const { uploadImage } = useImageUpload();

  const handleProfileUpdate: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      if (fileInput.file && authUser) {
        const urlRef = `${authUser.uid}/profilePic/`;
        uploadImage(urlRef, fileInput.file, async (url: string) => {
          await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), {
            profilePic: url,
          });
        });
      }
      if (data.bio && authUser) {
        await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), {
          bio: data.bio,
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
    Boolean(errors.bio) ||
    Boolean(fileInput.error) ||
    !bio ||
    (bio === authUser?.bio && !fileInput.file) ||
    loading;

  const handleChange = (files: CustomFile[]) => {
    if (files.length > 0) {
      setFileInput({
        file: files[0],
        error: '',
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
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <form noValidate onSubmit={handleSubmit(handleProfileUpdate)}>
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl">Edit Profile</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={1}>
              <FormControl isInvalid={false}>
                <FormLabel mt={5}>Change profile pic</FormLabel>
                <div className="flex justify-center overflow-hidden px-3">
                  <div className="inline-block cursor-pointer">
                    <Files
                      onChange={handleChange}
                      onError={handleError}
                      accepts={['image/*']}
                      maxFileSize={1000000}
                      minFileSize={0}
                      clickable
                    >
                      <MemoizedProfile
                        username={authUser?.username || ''}
                        selectedImage={fileInput.file?.preview.url}
                        defaultImage={
                          authUser?.profilePic || DEFAULT_PROFILE_PIC
                        }
                      />
                    </Files>
                  </div>
                </div>
                <ErrorLabel validationError={fileInput.error} />
                <FormLabel>Change your Bio</FormLabel>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoFocus
                      name="bio"
                      placeholder="Your bio"
                    />
                  )}
                />
                <ErrorLabel validationError={errors.bio?.message} />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isDisabled}
              color="white"
              colorScheme="ghost"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              isLoading={loading}
              rounded="full"
              color="white"
              colorScheme="brand"
              variant="solid"
              type="submit"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
export default UpdateProfileModal;
