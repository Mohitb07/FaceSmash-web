import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useState } from 'react';

import type { CustomFile } from '@/interface';

export const useImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const storage = getStorage();
  const uploadImage = (
    urlRef: string,
    file: CustomFile,
    cb: (url: string) => void
  ) => {
    const storageRef = ref(storage, urlRef);
    const uploadTask = uploadBytesResumable(
      storageRef,
      file as unknown as Blob
    );
    uploadTask.on(
      'state_changed',
      (snap) => {
        const percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setProgress(percentage);
      },
      (err) => setError(err.message),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          if (url) {
            if (typeof cb === 'function') {
              cb(url);
            }
          }
        } catch (err) {
          console.log('ERROR while downloading image url', err);
        }
      }
    );
  };

  return { uploadImage, progress, error };
};
