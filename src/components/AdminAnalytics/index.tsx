import {
  Avatar,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { BiRefresh, BiSearch, BiTrash, BiUserCheck } from 'react-icons/bi';
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiUsers,
} from 'react-icons/fi';
import { MdOutlineAdminPanelSettings, MdOutlinePostAdd } from 'react-icons/md';
import { TbUserPlus } from 'react-icons/tb';

import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { checkIsAdmin } from '@/utils/isAdmin';

import { db } from '../../../firebase';

dayjs.extend(relativeTime);

const USERS_PER_PAGE = 10;

type AdminAnalyticsProps = {
  activeTab?: 'analytics' | 'users' | 'posts';
};

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ activeTab }) => {
  const {
    totalUsers,
    totalPosts,
    signupsToday,
    signupsThisWeek,
    signupsThisMonth,
    users,
    loading,
    error,
    refetch,
  } = useAdminAnalytics();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>(
    'newest'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    isOpen: isResetModalOpen,
    onOpen: onOpenResetModal,
    onClose: onCloseResetModal,
  } = useDisclosure();
  const toast = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleResetDatabase = async () => {
    try {
      setIsDeleting(true);

      // 1. Delete all posts
      const postsSnapshot = await getDocs(collection(db, 'Posts'));
      for (const postDoc of postsSnapshot.docs) {
        await deleteDoc(doc(db, 'Posts', postDoc.id));
      }

      // 2. Delete postlikes for each user
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      for (const userDoc of usersSnapshot.docs) {
        const likesSnapshot = await getDocs(
          collection(db, 'Users', userDoc.id, 'postlikes')
        );
        if (!likesSnapshot.empty) {
          const batch = writeBatch(db);
          likesSnapshot.forEach((likeDoc) => {
            batch.delete(doc(db, 'Users', userDoc.id, 'postlikes', likeDoc.id));
          });
          await batch.commit();
        }
      }

      toast({
        title: 'Database Reset Successfully',
        description: `Wiped ${postsSnapshot.size} posts and cleared all user like records.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });

      onCloseResetModal();
      await refetch();
    } catch (err: any) {
      console.error('Reset database error', err);
      toast({
        title: 'Failed to Reset Database',
        description: err?.message || 'Error occurred while deleting documents.',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'bottom-right',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Smooth scroll on activeTab change
  useEffect(() => {
    if (activeTab === 'users') {
      const el = document.getElementById('user-directory');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  // Filter & Sort Users
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.qusername.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.uid.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortOrder === 'newest') {
        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
      }
      if (sortOrder === 'oldest') {
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
      }
      if (sortOrder === 'name') {
        return a.username.localeCompare(b.username);
      }
      return 0;
    });

    return list;
  }, [users, searchTerm, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const startIndex =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * USERS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-zinc-100 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-600/20 text-purple-400">
              <MdOutlineAdminPanelSettings className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Admin Analytics
              </h1>
              <p className="text-xs text-zinc-400 sm:text-sm">
                Platform insights, registered users, and onboarding timestamps
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onOpenResetModal}
            disabled={loading || isDeleting}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
          >
            <BiTrash className="text-base text-red-400" />
            <span>Reset Posts & Likes</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading || isDeleting}
            className="flex items-center gap-2 rounded-xl border border-zinc-700/70 bg-[#16181c] px-4 py-2 text-xs font-semibold text-zinc-200 transition-all hover:border-purple-500/50 hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
          >
            <BiRefresh
              className={`text-lg ${
                isRefreshing ? 'animate-spin text-purple-400' : ''
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Users */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 shadow-xl transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Registered Users
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FiUsers className="text-xl" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {loading ? '...' : totalUsers}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              Active Database
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Total registered accounts in Firestore
          </p>
        </div>

        {/* Card 2: Total Posts */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 shadow-xl transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Total Posts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <MdOutlinePostAdd className="text-xl" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {loading ? '...' : totalPosts}
            </span>
            <span className="text-xs font-semibold text-purple-400">
              Published Content
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Total posts across all user feeds
          </p>
        </div>

        {/* Card 3: Signups Today */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 shadow-xl transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              New Signups Today
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <TbUserPlus className="text-xl" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {loading ? '...' : `+${signupsToday}`}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              Today
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Registered in the last 24 hours
          </p>
        </div>

        {/* Card 4: Signups This Week */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 shadow-xl transition-all hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Registered 7 Days
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <FiCalendar className="text-xl" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {loading ? '...' : `+${signupsThisWeek}`}
            </span>
            <span className="text-xs font-semibold text-amber-400">
              {signupsThisMonth} this month
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">New users in last 7 days</p>
        </div>
      </div>

      {/* Directory Section */}
      <div
        id="user-directory"
        className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-4 shadow-2xl sm:p-6"
      >
        {/* Controls Header */}
        <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white sm:text-xl">
              User Directory & Registration Timestamps
            </h2>
            <p className="text-xs text-zinc-400">
              Showing {filteredUsers.length} of {totalUsers} registered users
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-zinc-500" />
              <input
                type="text"
                placeholder="Search name, handle, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-zinc-700/60 bg-[#0c1014] py-2 pl-10 pr-4 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none sm:text-sm"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="rounded-xl border border-zinc-700/60 bg-[#0c1014] px-3.5 py-2 text-xs font-medium text-zinc-300 focus:border-purple-500 focus:outline-none sm:text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Spinner size="xl" color="purple.500" className="mb-4" />
            <p className="text-sm font-medium">Fetching registered users...</p>
          </div>
        ) : error ? (
          <div className="my-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-semibold text-red-400">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <BiUserCheck className="mb-2 text-5xl text-zinc-600" />
            <p className="text-base font-semibold text-zinc-300">
              No matching users found
            </p>
            <p className="text-xs text-zinc-500">
              Try adjusting your search keywords
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800/80 bg-[#0c1014]/60 shadow-inner">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="border-b border-zinc-800/80 bg-[#16181c] text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-5 py-4">
                      User
                    </th>
                    <th scope="col" className="whitespace-nowrap px-5 py-4">
                      Email
                    </th>
                    <th scope="col" className="whitespace-nowrap px-5 py-4">
                      Registered On
                    </th>
                    <th scope="col" className="whitespace-nowrap px-5 py-4">
                      Last Sign-In
                    </th>
                    <th scope="col" className="whitespace-nowrap px-5 py-4">
                      Role
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-5 py-4 text-right"
                    >
                      Profile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {paginatedUsers.map((u) => {
                    const isAdmin = checkIsAdmin(u);
                    const registeredDate = u.createdAt
                      ? dayjs(u.createdAt).format('MMM DD, YYYY')
                      : 'N/A';
                    const registeredTime = u.createdAt
                      ? dayjs(u.createdAt).format('hh:mm A')
                      : '';
                    const lastSignInFormatted = u.lastSignIn
                      ? dayjs(u.lastSignIn).fromNow()
                      : 'N/A';

                    return (
                      <tr
                        key={u.uid}
                        className="group transition-colors hover:bg-zinc-800/40"
                      >
                        {/* User Avatar + Name */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              name={u.username}
                              src={u.profilePic}
                              className="ring-2 ring-purple-500/20"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-white">
                                {u.username}
                              </span>
                              <span className="text-xs text-zinc-400">
                                @{u.qusername || 'user'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-300">
                          {u.email}
                        </td>

                        {/* Registration Date */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="text-sm font-semibold text-yellow-400">
                            {registeredDate}
                          </span>
                          {registeredTime && (
                            <span className="ml-2 text-xs font-medium text-zinc-400">
                              • {registeredTime}
                            </span>
                          )}
                        </td>

                        {/* Last Sign-in */}
                        <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-zinc-400">
                          {lastSignInFormatted}
                        </td>

                        {/* Role */}
                        <td className="whitespace-nowrap px-5 py-4">
                          {isAdmin ? (
                            <Badge
                              colorScheme="purple"
                              variant="solid"
                              borderRadius="full"
                              px="3"
                              py="0.5"
                              fontSize="xs"
                              className="font-semibold tracking-wide"
                            >
                              Admin
                            </Badge>
                          ) : (
                            <Badge
                              colorScheme="gray"
                              variant="subtle"
                              borderRadius="full"
                              px="3"
                              py="0.5"
                              fontSize="xs"
                              className="font-semibold tracking-wide"
                            >
                              Member
                            </Badge>
                          )}
                        </td>

                        {/* Action */}
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <Link
                            href={{
                              pathname: '/[username]',
                              query: {
                                username: u.qusername || u.username,
                                userId: u.uid,
                              },
                            }}
                          >
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-all hover:border-purple-500/60 hover:bg-purple-600 hover:text-white">
                              <span>View Profile</span>
                              <FiExternalLink className="text-xs" />
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Button-based Pagination Controls */}
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-[#0c1014]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              {/* Items Range Info */}
              <span className="text-xs font-medium text-zinc-400">
                Showing{' '}
                <span className="font-bold text-white">{startIndex}</span> to{' '}
                <span className="font-bold text-white">{endIndex}</span> of{' '}
                <span className="font-bold text-white">
                  {filteredUsers.length}
                </span>{' '}
                registered users
              </span>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-8 items-center gap-1 rounded-lg border border-zinc-700/60 bg-[#16181c] px-3 text-xs font-semibold text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft className="text-sm" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true;
                      return (
                        Math.abs(p - currentPage) <= 1 ||
                        p === 1 ||
                        p === totalPages
                      );
                    })
                    .map((page, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && page - prev > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-1 text-xs text-zinc-500">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 min-w-[32px] rounded-lg text-xs font-bold transition-all ${
                              currentPage === page
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'border border-zinc-700/60 bg-[#16181c] text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-800'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-8 items-center gap-1 rounded-lg border border-zinc-700/60 bg-[#16181c] px-3 text-xs font-semibold text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Next</span>
                  <FiChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={onCloseResetModal}
        isCentered
        size="md"
      >
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent
          bg="#16181c"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="2xl"
          color="white"
          p={2}
        >
          <ModalHeader className="flex items-center gap-2.5 text-lg font-bold text-red-400">
            <FiAlertTriangle className="text-2xl text-red-500" />
            <span>Reset Posts & Likes Database?</span>
          </ModalHeader>
          <ModalCloseButton color="zinc.400" _hover={{ color: 'white' }} />
          <ModalBody className="space-y-3 text-sm text-zinc-300">
            <p>
              This will permanently delete{' '}
              <strong className="text-white">all {totalPosts} posts</strong> in
              the database and clear all user{' '}
              <strong className="text-white">postlikes</strong> records.
            </p>
            <div className="rounded-xl border border-zinc-800 bg-[#0c1014] p-3 text-xs text-zinc-400">
              <span className="font-semibold text-emerald-400">Safe:</span> All
              user profiles, accounts, followers, and followings will remain
              completely intact.
            </div>
            <p className="text-xs font-medium text-red-400">
              This action cannot be undone. Are you sure you want to start
              fresh?
            </p>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="ghost"
              colorScheme="gray"
              size="sm"
              onClick={onCloseResetModal}
              isDisabled={isDeleting}
              className="rounded-xl text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={handleResetDatabase}
              isLoading={isDeleting}
              loadingText="Wiping Database..."
              className="rounded-xl font-bold"
            >
              Yes, Delete All Old Posts
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminAnalytics;
