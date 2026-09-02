import { Avatar } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiExit, BiHomeAlt } from 'react-icons/bi';
import { FiBarChart2, FiFileText, FiShield, FiUsers } from 'react-icons/fi';

import Brand from '@/components/Brand';
import type { User } from '@/interface';

type AdminSidebarProps = {
  user: User | null;
  activeTab: 'analytics' | 'users' | 'posts';
  setActiveTab: (tab: 'analytics' | 'users' | 'posts') => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
}) => {
  const router = useRouter();

  return (
    <aside className="flex h-screen w-full flex-col justify-between border-r border-zinc-800/80 bg-[#111317] p-4 text-zinc-300">
      <div className="space-y-6">
        {/* Admin Brand Header */}
        <div className="flex flex-col space-y-3 px-2 pt-2">
          <div className="flex items-center gap-2">
            <Brand />
          </div>
          <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-purple-500/30 bg-purple-600/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
            <FiShield className="text-sm" />
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Admin Nav Section */}
        <nav className="space-y-1.5 pt-4">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Management
          </span>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'border border-purple-500/40 bg-purple-600/20 text-white shadow-lg'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <FiBarChart2 className="text-lg text-purple-400" />
            <span>Analytics & Users</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'users'
                ? 'border border-purple-500/40 bg-purple-600/20 text-white shadow-lg'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <FiUsers className="text-lg text-blue-400" />
            <span>User Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'posts'
                ? 'border border-purple-500/40 bg-purple-600/20 text-white shadow-lg'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <FiFileText className="text-lg text-emerald-400" />
            <span>Posts Activity</span>
          </button>
        </nav>

        {/* Quick App Link */}
        <div className="space-y-1.5 pt-4">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Navigation
          </span>

          <button
            onClick={() => router.push('/')}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-zinc-400 transition-all hover:bg-zinc-800/60 hover:text-white"
          >
            <BiHomeAlt className="text-xl text-zinc-400" />
            <span>Return to App</span>
          </button>
        </div>
      </div>

      {/* Admin Profile Footer */}
      <div className="border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-[#0c1014] p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar
              size="sm"
              name={user?.username || 'Admin'}
              src={user?.profilePic}
              className="shrink-0 ring-2 ring-purple-500/30"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-bold text-white">
                {user?.username || 'Administrator'}
              </span>
              <span className="truncate text-[11px] font-medium text-purple-400">
                System Admin
              </span>
            </div>
          </div>

          <Link href="/">
            <button
              title="Exit Admin Panel"
              aria-label="Exit Admin Panel"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <BiExit className="text-lg" />
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
