import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';
import { MdLogout } from 'react-icons/md';

import { useAuthUser } from '@/hooks/useAuthUser';

const Settings = () => {
  const { logout } = useAuthUser();
  return (
    <Menu>
      <MenuButton>
        <ul>
          <li className="nav-item">
            <FiSettings className="ml-3 text-xl xl:text-3xl" />{' '}
          </li>
        </ul>
      </MenuButton>
      <MenuList backgroundColor="#242526" border="none" padding="2">
        <MenuItem
          onClick={logout}
          backgroundColor="transparent"
          _hover={{
            backgroundColor: '#40404F',
            borderRadius: '3px',
          }}
          icon={<MdLogout className="hover-animation text-xl" />}
        >
          <button
            aria-label="logout user"
            className="font-semibold text-red-500"
          >
            Log Out
          </button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Settings;
