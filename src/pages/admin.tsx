import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import AdminAnalytics from '@/components/AdminAnalytics';
import AdminSidebar from '@/components/AdminSidebar';
import Brand from '@/components/Brand';
import { useAuthUser } from '@/hooks/useAuthUser';
import { Meta } from '@/layouts/Meta';
import { withAuth } from '@/routes/WithProtected';
import { Main } from '@/templates/Main';
import { checkIsAdmin } from '@/utils/isAdmin';

const AdminPage = () => {
  const { authUser } = useAuthUser();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'posts'>(
    'analytics'
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const currentUser = authUser;
  const isAdmin = checkIsAdmin(currentUser);

  if (!isAdmin) {
    return (
      <Main
        meta={
          <Meta
            title="Access Denied | FaceSmash"
            description="Admin access required"
          />
        }
      >
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0C1014] px-4 text-center text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
            <MdOutlineAdminPanelSettings className="text-4xl" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Admin Access Restricted
          </h1>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            You are logged in as{' '}
            <span className="font-semibold text-zinc-200">
              {currentUser?.email || currentUser?.username || 'User'}
            </span>
            , which does not have administrator privileges to view platform
            analytics.
          </p>
          <Link href="/">
            <Button
              colorScheme="purple"
              size="md"
              className="mt-6 rounded-xl font-semibold"
            >
              Return to Home Feed
            </Button>
          </Link>
        </div>
      </Main>
    );
  }

  return (
    <Main
      meta={
        <Meta
          title="Admin Control Panel | FaceSmash"
          description="Standalone admin analytics and platform user management"
        />
      }
    >
      <div className="flex h-screen w-full overflow-hidden bg-[#0C1014] text-white">
        {/* Standalone Desktop Admin Sidebar */}
        <div className="hidden h-screen w-64 shrink-0 md:block">
          <AdminSidebar
            user={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Standalone Mobile Admin Header */}
        <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800/80 bg-[#111317]/95 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2">
            <Brand />
            <span className="rounded bg-purple-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-400">
              Admin
            </span>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open Admin Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300"
          >
            <BiMenu className="text-xl" />
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        <Drawer
          isOpen={isMobileNavOpen}
          placement="left"
          onClose={() => setIsMobileNavOpen(false)}
        >
          <DrawerOverlay />
          <DrawerContent bg="#111317" maxW="280px" p={0}>
            <DrawerBody p={0}>
              <AdminSidebar
                user={currentUser}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileNavOpen(false);
                }}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Standalone Admin Canvas */}
        <main className="h-screen flex-1 overflow-y-auto pt-14 md:pt-0">
          <AdminAnalytics activeTab={activeTab} />
        </main>
      </div>
    </Main>
  );
};

export default withAuth(AdminPage);
