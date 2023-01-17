import { Spinner } from '@chakra-ui/react';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { USERS_COLLECTION } from '../../constant';
import { useAuthUser } from '../../hooks/useAuthUser';
import { User } from '../../interface';
import UserCard from '../User';

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
      } finally {
        setIsLoading(false);
      }
    };
    getRandomUsers();
  }, [authUser?.uid]);

  if (isLoading) {
    return (
      <div className="w-[20rem] flex items-center justify-center h-[15rem]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-5 mt-10">
        <UserCard
          userId={authUser?.uid || ''}
          size="large"
          username={authUser?.username || ''}
          email={authUser?.email || ''}
          profileURL={authUser?.profilePic || ''}
        />
      </div>
      <div className="mt-5">
        <p className="text-xl text-gray-500 font-semibold tracking-wider">
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
