import { Skeleton, useDisclosure } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { FiMaximize2 } from 'react-icons/fi';

import ImagePreviewModal from '@/components/ImagePreviewModal';

type FeedImageProps = {
  postImage: string;
  link?: string;
  alt: string;
};

const FeedImage = ({ postImage, link, alt }: FeedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [hasError, setHasError] = useState(false);

  const onImageLoad = ({ target }: { target: EventTarget }) => {
    const { naturalWidth, naturalHeight } = target as HTMLImageElement;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
    setIsLoading(false);
  };

  const onImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="my-2 flex h-48 w-full flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-zinc-300 md:my-3">
        <p className="text-sm font-semibold text-amber-400">
          Image Unavailable (Firebase Storage 402)
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Firebase Storage bucket requires Blaze plan upgrade to serve this
          file.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={onOpen}
        className="group relative my-2 w-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/60 bg-black/40 shadow-inner md:my-3"
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            paddingTop: `calc(100% / ${Math.max(
              0.75,
              Math.min(1.91, aspectRatio)
            )})`,
            maxHeight: '560px',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10">
              <Skeleton
                height="100%"
                width="100%"
                startColor="zinc.800"
                endColor="zinc.700"
              />
            </div>
          )}

          <Image
            className={`transition-all duration-500 ease-out group-hover:scale-[1.02] ${
              isLoading
                ? 'scale-95 opacity-0 blur-sm'
                : 'scale-100 opacity-100 blur-0'
            }`}
            alt={alt}
            src={postImage}
            layout="fill"
            objectFit="contain"
            priority
            onLoad={onImageLoad}
            onError={onImageError}
          />

          {/* Hover Expand Badge */}
          <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-medium text-white/90 opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
            <FiMaximize2 className="text-xs" />
            <span className="hidden sm:inline">Preview</span>
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open post link"
              className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/90 hover:text-purple-300 active:scale-95"
            >
              <BiLinkExternal className="text-sm text-purple-400" />
              <span>Open Link</span>
            </a>
          )}
        </div>
      </div>

      <ImagePreviewModal
        isOpen={isOpen}
        onClose={onClose}
        imageSrc={postImage}
        alt={alt}
        link={link}
      />
    </>
  );
};

export default FeedImage;
