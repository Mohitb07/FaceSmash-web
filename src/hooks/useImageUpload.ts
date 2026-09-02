import { useState } from 'react';

import type { CustomFile } from '@/interface';

export const useImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const uploadImage = async (
    _urlRef: string,
    file: CustomFile,
    cb?: (url: string) => void
  ): Promise<string> => {
    setError('');
    setProgress(0);

    return new Promise(async (resolve, reject) => {
      try {
        // 1. Request signed parameters from our secure API route
        const signRes = await fetch('/api/sign-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder: 'facesmash_posts',
          }),
        });

        if (!signRes.ok) {
          const signErr = await signRes.json().catch(() => ({}));
          throw new Error(
            signErr.error || 'Failed to generate Cloudinary signature'
          );
        }

        const { signature, timestamp, apiKey, cloudName, folder } =
          await signRes.json();

        // 2. Prepare FormData for Cloudinary Upload API
        const formData = new FormData();
        formData.append('file', file as unknown as Blob);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);

        // 3. Upload with XMLHttpRequest for real-time progress tracking
        const xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress(percentage);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              const secureUrl = response.secure_url;
              if (secureUrl) {
                if (typeof cb === 'function') {
                  cb(secureUrl);
                }
                setProgress(100);
                resolve(secureUrl);
              } else {
                throw new Error('No secure_url returned from Cloudinary');
              }
            } catch (err: any) {
              setError(err.message || 'Failed to parse upload response');
              reject(err);
            }
          } else {
            let errorMsg = 'Cloudinary upload failed';
            try {
              const errResp = JSON.parse(xhr.responseText);
              errorMsg = errResp?.error?.message || errorMsg;
            } catch (_) {}
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          const err = new Error('Network error during image upload');
          setError(err.message);
          reject(err);
        };

        xhr.send(formData);
      } catch (err: any) {
        console.error('Error during signed upload process', err);
        setError(err.message || 'Failed to upload image');
        reject(err);
      }
    });
  };

  return { uploadImage, progress, error };
};
