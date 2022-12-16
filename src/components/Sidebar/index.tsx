import React, { useState } from 'react';

import { TiHome } from 'react-icons/ti';
import { BsSearch } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import Link from 'next/link';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import Avatar from '../Avatar';
import Brand from '../Brand';
import User from '../User';
import NavItem from '../NavItem';

const Sidebar = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postValue, setPostValue] = useState({
    title: '',
    description: '',
  });

  const searchDrawerClose = () => {
    if (isSearchDrawerOpen) {
      setIsSearchDrawerOpen(false);
    }
  };
  const modalClose = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handlePostValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPostValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  return (
    <div className="hidden md:flex fixed h-full flex-col justify-between bg-[#0b0b0b] pt-[5rem] px-[2rem] pb-[2rem]">
      <nav>
        <div className="hidden lg:block">
          <Brand styles="mb-[3rem] ml-[1rem]" />
        </div>

        <div className="block lg:hidden">
          <h1 className="text-6xl text-center font-bold text-white mb-[3rem]">
            <span className="text-primary-100">F</span>
          </h1>
        </div>

        <ul className="space-y-12 text-xl">
          {/* VscHome */}
          <Link href="/">
            <NavItem
              icon={<TiHome className="text-3xl hover-animation" />}
              label="Home"
            />
          </Link>
          <NavItem
            onClick={() => setIsSearchDrawerOpen(true)}
            icon={<BsSearch className="text-2xl hover-animation" />}
            label="Search"
          />
          <NavItem
            onClick={() => setIsModalOpen(true)}
            icon={<HiOutlinePlusCircle className="text-2xl hover-animation" />}
            label="Create"
          />
          <Link href="/mohitbisht1903">
            <NavItem label="Profile">
              <Avatar
                styles="hover-animation"
                url={
                  'https://lh3.googleusercontent.com/ogw/AOh-ky2wAgtbl4h_XUEs5x-5xfgBLXa_Aq0k6ahwaOxCgw=s32-c-mo'
                }
              />
            </NavItem>
          </Link>
        </ul>
      </nav>
      <div>
        <Menu>
          <MenuButton>
            <ul>
              <li className="nav-item">
                <RxHamburgerMenu className="text-3xl hover-animation" />{' '}
                <span className="hidden lg:block">More</span>
              </li>
            </ul>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <span className="text-red-500">Log Out</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <Drawer
        placement="left"
        onClose={searchDrawerClose}
        isOpen={isSearchDrawerOpen}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <h2 className="text-3xl">Search</h2>
            <div>
              <div className="flex w-full py-3 px-2 my-5 items-center bg-gray-800 rounded-md">
                <BsSearch className="text-xl text-slate-300 mx-3" />
                <input
                  className="w-full bg-transparent outline-none border-none"
                  type="text"
                  placeholder="Search User..."
                />
              </div>
            </div>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-xl">Recent</p>
            <User />
            <User />
            <User />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isModalOpen} onClose={modalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={1}>
              <FormControl isRequired isInvalid={false}>
                <FormLabel>Title</FormLabel>
                <Input
                  autoFocus
                  name='title'
                  focusBorderColor="brand.100"
                  rounded="lg"
                  value={postValue.title}
                  placeholder="Enter title of your post"
                  onChange={handlePostValueChange}
                />
                <FormErrorMessage>Your First name is invalid</FormErrorMessage>
                <FormLabel mt={5}>Description</FormLabel>
                <Textarea
                  name='description'
                  rounded="lg"
                  focusBorderColor="brand.100"
                  colorScheme="brand"
                  rows={10}
                  _placeholder={{ fontSize: 18 }}
                  value={postValue.description}
                  onChange={handlePostValueChange}
                  placeholder="Enter description of your post"
                  size="sm"
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              color="white"
              colorScheme="ghost"
              mr={3}
              onClick={modalClose}
            >
              Cancel
            </Button>
            <Button
              rounded="full"
              color="white"
              colorScheme="brand"
              variant="solid"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Sidebar;
