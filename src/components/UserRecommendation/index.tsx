import { Spinner } from '@chakra-ui/react';
import { collection, getDocs, query } from 'firebase/firestore';
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
        const filteredUsersList = unfilteredUsersList.filter(Boolean);
        while (userList.length < 4) {
          const randomIndex = Math.floor(
            Math.random() * filteredUsersList.length
          );
          const user = filteredUsersList.splice(randomIndex, 1)[0] as User; // Remove the user from the list
          userList.push(user);
        }

        setRandomSuggestion(userList);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRandomUsers();
  }, [authUser?.uid]);

  if (isLoading || !authUser) {
    return (
      <div className="flex-container h-[15rem] w-[15rem]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="hidden w-full pt-8 lg:block">
      <div className="">
        <div className="flex items-center gap-5">
          <UserCard
            userId={authUser.uid}
            size="md"
            fontSize="sm"
            username={authUser.username}
            email={authUser.email}
            profileURL={authUser.profilePic}
          />
        </div>
        <div className="mt-5">
          <p className="mb-5 font-semibold tracking-wider text-gray-400 xl:text-[1.1rem]">
            Suggested for you
          </p>
          <div className="space-y-5">
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
      </div>
    </div>
  );
};
export default UserRecommendation;
