import dayjs from 'dayjs';
import { collection, getDocs } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { POSTS_COLLECTION, USERS_COLLECTION } from '@/constant';
import type { User } from '@/interface';
import { checkIsAdmin } from '@/utils/isAdmin';

import { db } from '../../firebase';

export interface RegistrationTrend {
  date: string;
  count: number;
}

export interface AdminAnalyticsData {
  totalUsers: number;
  totalPosts: number;
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
  registrationTrend: RegistrationTrend[];
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdminAnalytics = (): AdminAnalyticsData => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Users
      const usersSnap = await getDocs(collection(db, USERS_COLLECTION));
      const fetchedUsers: User[] = usersSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          username: data.username || 'Anonymous',
          qusername: data.qusername || data.username?.toLowerCase() || '',
          email: data.email || 'N/A',
          profilePic: data.profilePic || '',
          createdAt: data.createdAt || '',
          lastSignIn: data.lastSignIn || '',
          bio: data.bio || '',
          role: data.role || (checkIsAdmin(data as User) ? 'admin' : 'member'),
        };
      });

      // 2. Fetch Posts Count
      const postsSnap = await getDocs(collection(db, POSTS_COLLECTION));
      setTotalPosts(postsSnap.size);

      // Sort users by createdAt descending by default
      fetchedUsers.sort((a, b) => {
        const timeA = a.createdAt ? dayjs(a.createdAt).valueOf() : 0;
        const timeB = b.createdAt ? dayjs(b.createdAt).valueOf() : 0;
        return timeB - timeA;
      });

      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error('Error fetching admin analytics data:', err);
      setError(err?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute Metrics
  const now = dayjs();
  const startOfDay = now.startOf('day');
  const startOfWeek = now.subtract(7, 'day');
  const startOfMonth = now.subtract(30, 'day');

  let signupsToday = 0;
  let signupsThisWeek = 0;
  let signupsThisMonth = 0;

  const dateMap: Record<string, number> = {};

  users.forEach((u) => {
    if (!u.createdAt) return;
    const createdDate = dayjs(u.createdAt);

    if (createdDate.isAfter(startOfDay)) {
      signupsToday += 1;
    }
    if (createdDate.isAfter(startOfWeek)) {
      signupsThisWeek += 1;
    }
    if (createdDate.isAfter(startOfMonth)) {
      signupsThisMonth += 1;
    }

    const dateKey = createdDate.format('MMM DD');
    dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
  });

  // Convert dateMap to array for visual trend
  const registrationTrend: RegistrationTrend[] = Object.keys(dateMap)
    .slice(-7)
    .map((date) => ({
      date,
      count: dateMap[date] || 0,
    }));

  return {
    totalUsers: users.length,
    totalPosts,
    signupsToday,
    signupsThisWeek,
    signupsThisMonth,
    registrationTrend,
    users,
    loading,
    error,
    refetch: fetchData,
  };
};
