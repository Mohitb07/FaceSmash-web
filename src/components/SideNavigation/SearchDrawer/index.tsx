import React, {memo} from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';

import User from '../../../components/User';

type SearchDrawerProps = {
  isSearchDrawerOpen: boolean;
  searchDrawerClose: () => void;
};

const SearchDrawer = ({
  isSearchDrawerOpen = false,
  searchDrawerClose,
}: SearchDrawerProps) => {
  return (
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default memo(SearchDrawer);
