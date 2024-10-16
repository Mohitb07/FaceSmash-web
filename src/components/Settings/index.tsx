import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { CiTrash } from 'react-icons/ci';
import { FiSettings } from 'react-icons/fi';

import { useAuthUser } from '@/hooks/useAuthUser';

import NavItem from '../NavItem';

type SettingsProps = {
  Icon?: IconType;
  label?: string;
};

const Settings = ({ Icon = FiSettings }: SettingsProps) => {
  const { logout } = useAuthUser();
  return (
    <Menu>
      <MenuButton>
        <NavItem label="More">
          <Icon className="text-xl xl:text-3xl" />
        </NavItem>
      </MenuButton>
      <MenuList backgroundColor="#242526" border="none" padding="2">
        <MenuItem
          onClick={logout}
          backgroundColor="transparent"
          _hover={{
            backgroundColor: '#40404F',
            borderRadius: '3px',
          }}
          icon={<CiTrash className="text-lg text-red-400" />}
        >
          <button aria-label="logout user" className="text-lg">
            Log Out
          </button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Settings;
