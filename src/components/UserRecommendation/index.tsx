import { Spinner } from '@chakra-ui/react';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import UserCard from '@/components/User';
import { USERS_COLLECTION } from '@/constant';
import { useAuthUser } from '@/hooks/useAuthUser';
import type { User } from '@/interface';

import { db } from '../../../firebase';

const UserRecommendation = () => {
  const { authUser } = useAuthUser();
  const [randomSuggestion, setRandomSuggestion] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          userList.push(filteredUsersList[randomIndex] as User);
        }
        setRandomSuggestion(userList);
      } catch (error) {
        console.log('ERROR while fetching random user data', error);
      } finally {
        setIsLoading(false);
      }
    };
    getRandomUsers();
  }, [authUser?.uid]);

  if (isLoading) {
    return (
      <div className="flex h-[15rem] w-[20rem] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex items-center gap-5">
        <UserCard
          userId={authUser?.uid || ''}
          size="lg"
          fontSize="2xl"
          username={authUser?.username || ''}
          email={authUser?.email || ''}
          profileURL={authUser?.profilePic || ''}
        />
      </div>
      <div className="mt-5">
        <p className="text-xl font-semibold tracking-wider text-gray-500">
          Suggestions for you
        </p>
        <div>
          {randomSuggestion.map((user) => (
            <UserCard
              key={user.uid}
              userId={user.uid}
              username={user.username}
              email={user.email}
              profileURL={user.profilePic}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default UserRecommendation;
