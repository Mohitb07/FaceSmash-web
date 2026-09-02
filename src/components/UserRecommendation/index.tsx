import { Spinner } from '@chakra-ui/react';
import { collection, getDocs, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import UserCard from '@/components/User';
import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { User } from '@/interface';

import { db } from '../../../firebase';

const UserRecommendation = () => {
  const { authUser } = useAuthUser();
  const [randomSuggestion, setRandomSuggestion] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleError = useErrorHandler();

  useEffect(() => {
    const getRandomUsers = async () => {
      try {
        let userList: User[] = [];
        const q = query(collection(db, USERS_COLLECTION));
        const querySnap = await getDocs(q);
        const unfilteredUsersList = querySnap.docs.map((d) => {
          if (d.id !== authUser?.uid) {
            return {
              ...(d.data() as User),
              key: d.id,
            };
          } else {
            return null;
          }
        });
        const filteredUsersList = unfilteredUsersList.filter(
          (user): user is User & { key: string } => Boolean(user)
        );
        while (userList.length < 4 && filteredUsersList.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filteredUsersList.length
          );
          const [user] = filteredUsersList.splice(randomIndex, 1);
          if (user) {
            userList.push(user);
          }
        }

        setRandomSuggestion(userList);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRandomUsers();
  }, [authUser?.uid, handleError]);

  if (isLoading || !authUser) {
    return (
      <div className="flex-container h-[15rem] w-[15rem]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="hidden w-full pt-5 lg:block">
      {/* Current User Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#1e1f23]/90 p-3.5 shadow-lg backdrop-blur-md">
        <UserCard
          userId={authUser.uid}
          size="md"
          fontSize="sm"
          username={authUser.username}
          email={authUser.email}
          profileURL={authUser.profilePic}
        />
      </div>

      {/* Suggested For You Card */}
      <div className="mt-5 rounded-2xl border border-zinc-800/80 bg-[#1e1f23]/90 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold tracking-tight text-zinc-200">
            Suggested for you
          </p>
          <span className="cursor-pointer text-xs font-semibold text-purple-400 hover:underline">
            See all
          </span>
        </div>
        <div className="space-y-1.5">
          {randomSuggestion.map((user) => (
            <UserCard
              size="md"
              fontSize="sm"
              key={user.uid}
              userId={user.uid}
              username={user.username}
              email={user.email}
              profileURL={user.profilePic}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 space-y-1 px-2 text-xs text-zinc-400">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <span>·</span>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
        <p className="pt-2 font-medium text-zinc-400">© 2026 FaceSmash</p>
      </div>
    </div>
  );
};
export default UserRecommendation;
