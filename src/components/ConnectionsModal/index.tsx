import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

import User from '@/components/User';
import type { User as UserDetail } from '@/interface';

type ConnectionModalProps = {
  title: string;
  onClose: () => void;
  isOpen: boolean;
  data: UserDetail[];
  isMobile?: boolean;
};

const ConnectionModal = ({
  title,
  onClose,
  isOpen,
  data = [],
  isMobile = false,
}: ConnectionModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? 'sm' : 'lg'}
      closeOnEsc
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(6px)" />
      <ModalContent
        backgroundColor="#1e1f23"
        border="1px solid rgba(63, 63, 70, 0.6)"
        borderRadius="2xl"
        paddingBottom="5"
        shadow="2xl"
      >
        <ModalHeader
          textAlign="center"
          fontSize={isMobile ? 'lg' : 'xl'}
          fontWeight="bold"
          color="zinc.100"
        >
          {title}
        </ModalHeader>
        <Divider borderColor="zinc.800" />
        <ModalCloseButton
          color="zinc.400"
          _hover={{ color: 'white', bg: 'zinc.800' }}
          rounded="full"
        />
        <ModalBody maxHeight="md" className="space-y-3 pt-4">
          {data.length === 0 && (
            <p className="py-6 text-center text-sm font-medium text-zinc-500">
              No {title.toLowerCase()} found
            </p>
          )}
          {data.map((user) => (
            <User
              key={user.uid}
              size="md"
              fontSize="md"
              username={user.username}
              profileURL={user.profilePic}
              userId={user.uid}
              email={user.email}
              onClose={onClose}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ConnectionModal;
