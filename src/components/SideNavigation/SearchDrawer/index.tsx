import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Spinner,
} from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import React, { memo, useCallback, useState } from 'react';
import { BiSearch, BiX } from 'react-icons/bi';
import { FiArrowUpRight, FiSearch, FiUsers } from 'react-icons/fi';

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
    const cleanQuery = data.trim().toLowerCase();
    if (!cleanQuery) {
      setUserList([]);
      setLoading(false);
      return;
    }
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('qusername', '>=', cleanQuery),
        where('qusername', '<=', cleanQuery + '\uf8ff')
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
    debounce(onSearchQueryChange, 300),
    []
  );

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchValue(searchQuery);
    if (!searchQuery.trim()) {
      setUserList([]);
      setLoading(false);
    } else {
      setLoading(true);
      debounceSearchField(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setUserList([]);
    setLoading(false);
  };

  return (
    <Drawer
      placement="left"
      onClose={searchDrawerClose}
      isOpen={isSearchDrawerOpen}
      size="md"
    >
      <DrawerOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <DrawerContent
        bg="#131518"
        borderRight="1px solid"
        borderColor="whiteAlpha.100"
        color="white"
        shadow="2xl"
      >
        <DrawerCloseButton
          color="zinc.400"
          _hover={{ color: 'white', bg: 'zinc.800' }}
          rounded="full"
          top="4"
          right="4"
        />

        {/* Header with Search Box */}
        <DrawerHeader
          pt={6}
          pb={4}
          px={6}
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Explore Users
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Find and connect with friends, creators, and colleagues
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <BiSearch className="text-lg" />
            </div>
            <input
              value={searchValue}
              type="text"
              autoFocus
              placeholder="Search by username or handle..."
              onChange={onChangeHandler}
              className="w-full rounded-2xl border border-zinc-800 bg-[#0C1014] py-3 px-10 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/40"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 transition-colors hover:text-white"
              >
                <BiX className="text-xl" />
              </button>
            )}
          </div>
        </DrawerHeader>

        {/* Search Results Body */}
        <DrawerBody px={6} py={5} className="space-y-4">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Spinner
                size="md"
                color="purple.400"
                thickness="3px"
                speed="0.7s"
              />
              <p className="mt-3 text-xs font-medium text-zinc-400">
                Searching FaceSmash...
              </p>
            </div>
          )}

          {/* Initial Blank State (Before search) */}
          {!isLoading && searchValue.trim().length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#0C1014] text-zinc-400">
                <FiUsers className="text-2xl text-zinc-400" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">
                Search for Members
              </h3>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-400">
                Type a username above to find user profiles, view their posts,
                and follow them.
              </p>
            </div>
          )}

          {/* No Results Found State */}
          {!isLoading &&
            searchValue.trim().length > 0 &&
            userList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#0C1014] text-zinc-500">
                  <FiSearch className="text-2xl text-zinc-500" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">
                  No users found
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  No accounts match &ldquo;
                  <span className="font-semibold text-zinc-200">
                    {searchValue}
                  </span>
                  &rdquo;. Check for spelling errors or try a shorter username.
                </p>
              </div>
            )}

          {/* Found Results */}
          {!isLoading && userList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Search Results
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-800/80 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                  {userList.length} {userList.length === 1 ? 'user' : 'users'}
                </span>
              </div>

              <div className="space-y-2">
                {userList.map((user) => {
                  const userHandle = `@${
                    user.username?.toLowerCase().replace(/\s+/g, '') || 'user'
                  }`;
                  return (
                    <Link
                      key={user.uid}
                      href={{
                        pathname: '/[username]',
                        query: { username: user.username, userId: user.uid },
                      }}
                    >
                      <div
                        onClick={searchDrawerClose}
                        className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800/60 bg-[#0C1014]/60 p-3 transition-all duration-200 hover:border-zinc-700/80 hover:bg-[#16181c] active:scale-[0.99]"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <Avatar
                            size="md"
                            src={user.profilePic}
                            name={user.username}
                            className="ring-2 ring-zinc-700/60 transition-transform group-hover:scale-105"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-bold text-white transition-colors group-hover:text-purple-400">
                                {user.username}
                              </span>
                            </div>
                            <span className="truncate text-xs font-medium text-zinc-400">
                              {userHandle}
                            </span>
                            {user.email && (
                              <p className="truncate text-[11px] text-zinc-500">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* View Profile Action Icon */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60 text-zinc-400 transition-colors group-hover:bg-purple-600/20 group-hover:text-purple-300">
                          <FiArrowUpRight className="text-base" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default memo(SearchDrawer);
