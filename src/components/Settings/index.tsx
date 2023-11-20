import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { FiSettings } from 'react-icons/fi';

import { useAuthUser } from '@/hooks/useAuthUser';

type SettingsProps = {
  Icon?: IconType;
  label?: string;
};

const Settings = ({ Icon = FiSettings, label = '' }: SettingsProps) => {
  const { logout } = useAuthUser();
  return (
    <Menu>
      <MenuButton>
        <ul>
          <li className="nav-item">
            <Icon className="ml-3 text-xl xl:text-3xl" />
            {label.length > 0 && <p>{label}</p>}
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
          icon={
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/ff0000/external-online-account-logout-with-arrow-direction-mark-login-bold-tal-revivo.png"
              alt="external-online-account-logout-with-arrow-direction-mark-login-bold-tal-revivo"
            />
          }
        >
          <button aria-label="logout user" className="font-semibold">
            Log Out
          </button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Settings;
