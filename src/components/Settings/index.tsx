import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FiLogOut, FiSettings } from 'react-icons/fi';

import { useAuthUser } from '@/hooks/useAuthUser';

import NavItem from '../NavItem';

type SettingsProps = {
  Icon?: IconType;
  label: string;
};

const Settings = ({ Icon = FiSettings, label }: SettingsProps) => {
  const { logout } = useAuthUser();
  return (
    <Menu placement="top-start" isLazy>
      <MenuButton as="div" className="w-full cursor-pointer">
        <NavItem label={label}>
          <Icon className="text-xl xl:text-2xl" />
        </NavItem>
      </MenuButton>
      <MenuList
        backgroundColor="#16181c"
        borderColor="whiteAlpha.100"
        borderRadius="2xl"
        shadow="2xl"
        padding="2"
        minW="180px"
        zIndex="50"
      >
        <Link href="/about">
          <MenuItem
            backgroundColor="transparent"
            color="white"
            _hover={{
              backgroundColor: '#27272a',
              borderRadius: 'xl',
              color: 'white',
            }}
            className="cursor-pointer py-2.5 text-xs font-semibold"
          >
            About FaceSmash
          </MenuItem>
        </Link>
        <Link href="/help">
          <MenuItem
            backgroundColor="transparent"
            color="white"
            _hover={{
              backgroundColor: '#27272a',
              borderRadius: 'xl',
              color: 'white',
            }}
            className="cursor-pointer py-2.5 text-xs font-semibold"
          >
            Help & Support
          </MenuItem>
        </Link>
        <Link href="/privacy">
          <MenuItem
            backgroundColor="transparent"
            color="white"
            _hover={{
              backgroundColor: '#27272a',
              borderRadius: 'xl',
              color: 'white',
            }}
            className="cursor-pointer py-2.5 text-xs font-semibold"
          >
            Privacy Policy
          </MenuItem>
        </Link>
        <Link href="/terms">
          <MenuItem
            backgroundColor="transparent"
            color="white"
            _hover={{
              backgroundColor: '#27272a',
              borderRadius: 'xl',
              color: 'white',
            }}
            className="cursor-pointer py-2.5 text-xs font-semibold"
          >
            Terms & Conditions
          </MenuItem>
        </Link>
        <div className="my-1.5 border-t border-zinc-800/80" />
        <MenuItem
          onClick={logout}
          backgroundColor="transparent"
          color="red.400"
          _hover={{
            backgroundColor: '#27272a',
            borderRadius: 'xl',
            color: 'red.300',
          }}
          _focus={{
            backgroundColor: '#27272a',
            color: 'red.300',
          }}
          icon={<FiLogOut className="text-base text-red-400" />}
          className="py-2.5 text-xs font-semibold"
        >
          <span>Log Out</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Settings;
