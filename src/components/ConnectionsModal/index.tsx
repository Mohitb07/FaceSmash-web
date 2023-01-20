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
import User from '../User';

type ConnectionModalProps = {
  title: string;
  onClose: () => void;
  isOpen: boolean;
};

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  title,
  onClose,
  isOpen,
}) => {
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
          <User
            size="lg"
            fontSize="lg"
            username="Mohit Bisht"
            profileURL="https://scontent-del1-2.cdninstagram.com/v/t51.2885-19/316214120_182178971063229_4795247802278145839_n.jpg?stp=dst-jpg_s320x320&_nc_ht=scontent-del1-2.cdninstagram.com&_nc_cat=109&_nc_ohc=KqaJhwKaq5MAX--U4tx&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfAaOayf5uQJv9Rm0bIDG8Sj-Q3147LhTUslRxmExtmqMQ&oe=63CEA475&_nc_sid=8fd12b"
            userId="fadsfsadf"
            email="bmohit980@gmail.com"
          />
          
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ConnectionModal;
