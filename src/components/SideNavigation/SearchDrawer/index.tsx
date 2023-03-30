import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { memo, useCallback, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import User from '@/components/User';
import { USERS_COLLECTION } from '@/constant';
import type { User as UserDetail } from '@/interface';
import { debounce } from '@/utils/debounce';

import { db } from '../../../../firebase';

type SearchDrawerProps = {
  isSearchDrawerOpen: boolean;
  searchDrawerClose: () => void;
};

const SearchDrawer = ({
  isSearchDrawerOpen = false,
  searchDrawerClose,
}: SearchDrawerProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [userList, setUserList] = useState<UserDetail[]>([]);
  const [isLoading, setLoading] = useState(false);

  const onSearchQueryChange = async (data = '') => {
    try {
      if (!data.trim()) return;
      const q = query(
        collection(db, USERS_COLLECTION),
        where('qusername', '>=', data),
        where('qusername', '<=', data + '\uf8ff')
      );
      const querySnap = await getDocs(q);
      const list = querySnap.docs.map((user) => user.data() as UserDetail);
      setUserList(list);
    } catch (error) {
      console.error('error while fetching search query', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchField = useCallback(
    debounce(onSearchQueryChange, 1000),
    []
  );

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userList.length > 0) {
      setUserList([]);
    }
    const searchQuery = e.target.value;
    setSearchValue(searchQuery);
    if (searchQuery.trim()) {
      setLoading(true);
      debounceSearchField(searchQuery);
    }
  };

  return (
    <Drawer
      placement="left"
      onClose={searchDrawerClose}
      isOpen={isSearchDrawerOpen}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text fontSize="3xl">Search</Text>
          <InputGroup mt="5">
            <InputLeftElement pointerEvents="none">
              <BsSearch className="mt-2 text-lg text-slate-300" />
            </InputLeftElement>
            <Input
              value={searchValue}
              type="text"
              errorBorderColor="crimson"
              focusBorderColor="brand.100"
              colorScheme="brand"
              placeholder="Search User..."
              onChange={onChangeHandler}
              variant="filled"
              size="lg"
            />
          </InputGroup>
        </DrawerHeader>
        <DrawerBody>
          {isLoading && (
            <Flex mt="10" justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          )}
          {!isLoading && userList.length > 0 && (
            <Text fontSize="xl">Result ({userList.length})</Text>
          )}
          {!isLoading && searchValue.length > 0 && userList.length === 0 && (
            <Text fontSize="xl">No result found for: {searchValue}</Text>
          )}
          {userList.map((user) => (
            <User
              key={user.uid}
              profileURL={user.profilePic}
              userId={user.uid}
              email={user.email}
              username={user.username}
              onClose={searchDrawerClose}
            />
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default memo(SearchDrawer);
