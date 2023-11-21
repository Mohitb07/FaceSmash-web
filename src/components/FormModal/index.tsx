import type { ResponsiveValue } from '@chakra-ui/react';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import React from 'react';

import Button from '@/components/Button';

type FormModalProps = {
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  isOpen: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
  hasFooter?: boolean;
  footerBtnLabel?: string;
  modalSize?:
    | ResponsiveValue<
        | '4xl'
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | (string & {})
        | 'xs'
        | '3xl'
        | '5xl'
        | '6xl'
        | 'full'
      >
    | undefined;
};

const FormModal: React.FC<FormModalProps> = ({
  isOpen = false,
  onClose,
  onSubmit,
  title = '',
  isLoading = false,
  isDisabled = false,
  hasFooter = true,
  footerBtnLabel = '',
  modalSize = '4xl',
  children,
}) => {
  const [isMobile] = useMediaQuery('(max-width: 400px)');
  const [isMedium] = useMediaQuery('(max-width: 768px)');
  const [isLarge] = useMediaQuery('(max-width: 1024px)');

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : modalSize}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <form noValidate onSubmit={onSubmit}>
        <ModalContent>
          <ModalHeader>
            <Text
              fontSize={
                isMobile ? 'sm' : isMedium ? 'md' : isLarge ? 'lg' : '2xl'
              }
            >
              {title}
            </Text>
          </ModalHeader>
          <ModalCloseButton disabled={isLoading} />
          <ModalBody>
            <Box p={1}>{children}</Box>
          </ModalBody>
          {hasFooter && (
            <ModalFooter>
              <Button
                aria-label="Close modal"
                disabled={isLoading}
                colorScheme="ghost"
                mr={3}
                onClick={onClose}
                fontSize={isMobile ? 'sm' : 'md'}
              >
                Cancel
              </Button>
              <Button
                isDisabled={isDisabled}
                aria-label={title}
                type="submit"
                isLoading={isLoading}
                fontSize={isMobile ? 'sm' : 'md'}
              >
                {footerBtnLabel}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
};
export default FormModal;
