import {
  Avatar,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import Files from 'react-files';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form/dist/types';
import { MdErrorOutline } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import * as yup from 'yup';

import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { CustomFile } from '@/interface';

import { db } from '../../../firebase';
import ErrorLabel from '../ErrorLabel';
import FormModal from '../FormModal';

type UpdateProfileModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const schema = yup.object({
  bio: yup.string().max(160, 'Bio cannot exceed 160 characters'),
  website: yup
    .string()
    .max(100, 'Website URL cannot exceed 100 characters')
    .nullable(),
});

type FormData = yup.InferType<typeof schema>;

type FileInput = {
  file: CustomFile | null;
  error: string;
};

const UpdateProfileModal = ({ onClose, isOpen }: UpdateProfileModalProps) => {
  const { authUser } = useAuthUser();
  const toast = useToast();
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
      website: authUser?.website || '',
    },
  });
  const bio = watch('bio');
  const website = watch('website');
  const { uploadImage } = useImageUpload();

  const handleProfileUpdate: SubmitHandler<FormData> = async (data) => {
    if (!authUser) return;
    try {
      setLoading(true);
      const updateData: {
        profilePic?: string;
        bio?: string;
        website?: string;
        coverPic?: string;
      } = {};

      if (fileInput.file) {
        const fileExtension = fileInput.file.extension || 'jpg';
        const urlRef = `${
          authUser.uid
        }/profilePic/profile_${Date.now()}.${fileExtension}`;
        const url = await uploadImage(urlRef, fileInput.file);
        updateData.profilePic = url;
      }

      if (typeof data.bio === 'string' && data.bio !== (authUser.bio || '')) {
        updateData.bio = data.bio.trim();
      }

      if (
        typeof data.website === 'string' &&
        data.website !== (authUser.website || '')
      ) {
        updateData.website = data.website.trim();
      }

      if (Object.keys(updateData).length > 0) {
        await updateDoc(doc(db, USERS_COLLECTION, authUser.uid), updateData);
        toast({
          title: 'Profile updated successfully',
          variant: 'left-accent',
          position: 'bottom-right',
          isClosable: true,
          colorScheme: 'purple',
          icon: <TiTick className="text-2xl" />,
        });
      }
      onClose();
    } catch (error) {
      console.log('Profile update error', error);
      toast({
        title: 'Something went wrong while updating profile',
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'purple',
        icon: <MdErrorOutline className="text-2xl" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !fileInput.file &&
    bio === (authUser?.bio || '') &&
    website === (authUser?.website || '');

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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      isLoading={loading}
      isDisabled={isDisabled}
      onSubmit={handleSubmit(handleProfileUpdate)}
      footerBtnLabel="Update"
      title="Edit Profile"
      modalSize="md"
    >
      <FormControl isInvalid={false}>
        <FormLabel mt={5}>Change profile pic</FormLabel>
        <div className="flex justify-center py-2 px-3">
          <div className="group relative inline-block cursor-pointer">
            <Files
              onChange={handleChange}
              onError={handleError}
              accepts={['image/*']}
              maxFileSize={1000000}
              minFileSize={0}
              clickable
            >
              <div className="relative p-1">
                <Avatar
                  _hover={{ opacity: 0.8 }}
                  onError={() => console.log('image error')}
                  loading="lazy"
                  ignoreFallback
                  size="2xl"
                  name={authUser?.username || ''}
                  src={fileInput.file?.preview.url ?? authUser?.profilePic}
                  className="ring-2 ring-purple-500/50 transition-all group-hover:ring-purple-500"
                />
                <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-semibold text-white">
                    Change
                  </span>
                </div>
              </div>
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
              placeholder="Add a short bio..."
            />
          )}
        />
        <ErrorLabel validationError={errors.bio?.message} />

        <FormLabel mt={4}>Website or Portfolio Link</FormLabel>
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              name="website"
              placeholder="e.g. yoursite.com or https://github.com/..."
            />
          )}
        />
        <ErrorLabel validationError={errors.website?.message} />
      </FormControl>
    </FormModal>
  );
};
export default UpdateProfileModal;
