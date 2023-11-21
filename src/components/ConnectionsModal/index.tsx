import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
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
      <ModalOverlay />
      <ModalContent borderRadius="2xl" paddingBottom="5">
        <ModalHeader textAlign="center" fontSize={isMobile ? 'large' : '2xl'}>
          {title}
        </ModalHeader>
        <Divider />
        <ModalCloseButton fontSize={isMobile ? 'medium' : 'large'} />
        <ModalBody maxHeight="md">
          {data.length === 0 && (
            <Text textAlign="center" fontSize={isMobile ? 'medium' : 'large'}>
              No {title}
            </Text>
          )}
          {data.map((user) => (
            <User
              key={user.uid}
              size={isMobile ? 'md' : 'lg'}
              fontSize={isMobile ? 'medium' : 'large'}
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
