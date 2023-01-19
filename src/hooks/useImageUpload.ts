import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useState } from 'react';

export const useImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const storage = getStorage();
  const uploadImage = (
    urlRef: string,
    file: Blob | MediaSource,
    cb: (url: string) => void
  ) => {
    const storageRef = ref(storage, urlRef);
    const uploadTask = uploadBytesResumable(storageRef, file as Blob);
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
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        if (url) {
          if (typeof cb === 'function') {
            cb(url);
          }
        }
      }
    );
  };

  return { uploadImage, progress, error };
};