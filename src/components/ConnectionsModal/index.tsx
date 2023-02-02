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
};

const ConnectionModal = ({
  title,
  onClose,
  isOpen,
  data = [],
}: ConnectionModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="lg"
      closeOnEsc
    >
      <ModalOverlay />
      <ModalContent borderRadius="2xl" paddingBottom="5">
        <ModalHeader textAlign="center" fontSize="3xl">
          {title}
        </ModalHeader>
        <Divider />
        <ModalCloseButton fontSize="2xl" />
        <ModalBody maxHeight="md">
          {data.length === 0 && (
            <Text textAlign="center" fontSize="xl">
              No {title}
            </Text>
          )}
          {data.map((user) => (
            <User
              key={user.uid}
              size="lg"
              fontSize="lg"
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
