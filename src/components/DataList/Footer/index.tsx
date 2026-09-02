import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

const PostSkeletonCard = () => (
  <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] p-3.5 shadow-2xl sm:rounded-[28px] sm:p-5">
    {/* Header: Avatar, Info Stack, Options */}
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <SkeletonCircle
          size="10"
          startColor="#24262b"
          endColor="#32343a"
          className="ring-2 ring-purple-500/20 sm:h-12 sm:w-12"
        />
        <div className="space-y-2">
          {/* Handle */}
          <Skeleton
            height="13px"
            width="100px"
            borderRadius="md"
            startColor="#24262b"
            endColor="#32343a"
          />
          {/* Display Name + Timestamp */}
          <div className="flex items-center space-x-2">
            <Skeleton
              height="14px"
              width="90px"
              borderRadius="md"
              startColor="#24262b"
              endColor="#32343a"
            />
            <Skeleton
              height="11px"
              width="50px"
              borderRadius="md"
              startColor="#4a3f14"
              endColor="#61521a"
            />
          </div>
        </div>
      </div>
      <SkeletonCircle size="5" startColor="#24262b" endColor="#32343a" />
    </div>

    {/* Description / Content Text */}
    <div className="my-2 space-y-2 md:my-3">
      <Skeleton
        height="13px"
        width="95%"
        borderRadius="md"
        startColor="#24262b"
        endColor="#32343a"
      />
      <Skeleton
        height="13px"
        width="70%"
        borderRadius="md"
        startColor="#24262b"
        endColor="#32343a"
      />
    </div>

    {/* Post Image Container */}
    <div className="my-2 md:my-3">
      <Skeleton
        height="320px"
        width="100%"
        borderRadius="2xl"
        startColor="#24262b"
        endColor="#32343a"
      />
    </div>

    {/* Actions Bar: 3 icon buttons on left */}
    <div className="mt-2.5 flex items-center justify-between sm:mt-4">
      <div className="flex items-center space-x-4">
        <SkeletonCircle size="6" startColor="#24262b" endColor="#32343a" />
        <SkeletonCircle size="6" startColor="#24262b" endColor="#32343a" />
        <SkeletonCircle size="6" startColor="#24262b" endColor="#32343a" />
      </div>
    </div>

    {/* Comment Input Bar Skeleton */}
    <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-[#0c1014]/70 px-3 py-1.5 sm:mt-4 sm:px-3.5 sm:py-2">
      <SkeletonCircle size="7" startColor="#24262b" endColor="#32343a" />
      <Skeleton
        height="12px"
        width="130px"
        borderRadius="md"
        startColor="#24262b"
        endColor="#32343a"
      />
    </div>
  </div>
);

const Footer = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center space-y-3.5 sm:space-y-6">
        <PostSkeletonCard />
        <PostSkeletonCard />
      </div>
    );
  }

  return null;
};

export default Footer;
