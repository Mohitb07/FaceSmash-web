import { Avatar, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import Files from 'react-files';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form/dist/types';
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

  const isDisabled = !fileInput.file && (!bio || bio === authUser?.bio);

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
              <Avatar
                _hover={{ opacity: 0.5 }}
                onError={() => console.log('image error')}
                loading="lazy"
                ignoreFallback
                size="2xl"
                name={authUser?.username || ''}
                src={fileInput.file?.preview.url ?? authUser?.profilePic}
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
            <Input {...field} autoFocus name="bio" placeholder="Your bio" />
          )}
        />
        <ErrorLabel validationError={errors.bio?.message} />
      </FormControl>
    </FormModal>
  );
};
export default UpdateProfileModal;
