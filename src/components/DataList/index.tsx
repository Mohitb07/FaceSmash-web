import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../interface';
import Feed from '../Feed';

type PostListProps = {
  list: Post[];
  isLoading: boolean;
};

const PostList = ({ list, isLoading }: PostListProps) => {
  if (isLoading) {
    return (
      <div className="md:w-[500px] space-y-5 lg:w-[450px] xl:w-[600px] rounded-md">
        <div className="space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
        <div className="space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
        <div className="space-y-2">
          <SkeletonCircle height="14" width="14" />
          <Skeleton height="500px"></Skeleton>
          <SkeletonText spacing="4" />
        </div>
      </div>
    );
  }
  return (
    <>
      {list.map((feed) => (
        <Feed
          key={feed.key}
          username={feed.username}
          postImage={feed.image}
          userProfile={feed.userProfile}
          createdAt={feed.createdAt}
          description={feed.description}
          link={feed.link}
          imageRef={feed.imageRef}
          likes={feed.likes}
          userId={feed.user}
          postTitle={feed.title}
          postId={feed.key}
        />
      ))}
      <>
        <p className="text-center text-gray-500">End Of Result</p>
      </>
    </>
  );
};
export default PostList;
