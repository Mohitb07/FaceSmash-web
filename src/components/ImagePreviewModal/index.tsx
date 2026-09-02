import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { FiX } from 'react-icons/fi';

type ImagePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | { src: string };
  alt?: string;
  link?: string;
};

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  alt,
  link,
}) => {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc =
    typeof imageSrc === 'string' ? imageSrc : imageSrc?.src || '';

  if (!resolvedSrc) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="full"
      motionPreset="scale"
    >
      <ModalOverlay
        bg="blackAlpha.900"
        backdropFilter="blur(16px)"
        transition="all 0.2s ease"
      />
      <ModalContent
        bg="transparent"
        border="none"
        shadow="none"
        m={0}
        p={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        onClick={onClose}
      >
        {/* Floating Top Controls */}
        <div
          className="fixed top-4 right-4 z-50 flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open post link in new tab"
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-zinc-900/90 px-4 py-2 text-xs font-semibold text-zinc-100 shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-purple-400 active:scale-95 sm:text-sm"
            >
              <BiLinkExternal className="text-sm" />
              <span>Visit Link</span>
            </a>
          )}
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-xl text-zinc-200 shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
          >
            <FiX />
          </button>
        </div>

        <ModalBody
          p={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
          w="full"
          h="full"
          maxW="100vw"
          onClick={onClose}
        >
          {/* Frameless Centered Image Viewport */}
          <div
            className="relative h-[85vh] w-[92vw] max-w-6xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {!hasError ? (
              <Image
                src={resolvedSrc}
                alt={alt || 'Image preview'}
                layout="fill"
                objectFit="contain"
                priority
                onError={() => setHasError(true)}
              />
            ) : (
              <img
                src={resolvedSrc}
                alt={alt || 'Image preview'}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {/* Floating Caption / Title */}
          {alt && alt !== 'Post image' && (
            <div
              className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-auto max-w-lg truncate rounded-full border border-zinc-800/80 bg-[#16181c]/90 px-5 py-2 text-center text-xs font-semibold text-zinc-200 shadow-2xl backdrop-blur-md sm:text-sm">
                {alt}
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreviewModal;
