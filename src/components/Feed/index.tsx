import {
  Avatar,
  Collapse,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { BiLink } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiTrash } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
// import { HiOutlinePaperAirplane } from 'react-icons/hi';
// import { TbMessageCircle2 } from 'react-icons/tb';
import { LiaEdit } from 'react-icons/lia';

import { useAuthUser } from '@/hooks/useAuthUser';
import { useHandlePost } from '@/hooks/useHandlePost';
import type { FeedProps } from '@/interface';

import FeedImage from './FeedImage';

dayjs.extend(relativeTime);

const Feed = ({
  username,
  postImage,
  userProfile,
  createdAt,
  description,
  likes,
  postId,
  postTitle,
  userId,
  imageRef,
  link,
  hasLiked,
  authUserId,
  handleLikes,
  setPostEditModal,
  setInitialPostValues,
  setPostId,
  setImageRef,
}: FeedProps) => {
  const { authUser } = useAuthUser();
  const [show, setShow] = useBoolean();
  const { deletePostWithImage, deletePostWithoutImage } = useHandlePost();

  const editHandler = () => {
    if (imageRef) setImageRef(imageRef);
    setPostId(postId);
    setInitialPostValues({
      title: postTitle,
      description,
      link,
      image: postImage,
    });
    setPostEditModal(true);
  };

  const handlePostDeletion = async (
    pid: string,
    postImg?: string,
    imgRef?: string
  ) => {
    if (authUser?.uid !== userId) return;
    if (postImg && imgRef) {
      await deletePostWithImage(pid, `${authUser?.uid}/posts/${imgRef}`);
    } else {
      await deletePostWithoutImage(pid);
    }
  };

  return (
    <article className="relative h-auto w-full max-w-2xl border-b border-slate-900 pb-3">
      <div>
        <div className="p-3">
          <header className="flex items-center">
            <div className="flex flex-1 items-center space-x-2">
              <div role="button">
                <Link
                  href={{
                    pathname: '/[username]',
                    query: { username, userId },
                  }}
                >
                  <Avatar ignoreFallback size="sm" src={userProfile} />
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  role="button"
                  className="text-xs font-semibold tracking-wider xl:text-base"
                >
                  <Link
                    href={{
                      pathname: '/[username]',
                      query: { username, userId },
                    }}
                  >
                    {username}
                  </Link>
                </span>
                <div className="space-x-2 text-xs xl:text-base">
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">
                    {dayjs(createdAt?.toDate()).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <nav role="menu">
              {authUserId === userId ? (
                <Menu isLazy closeOnSelect placement="bottom-end">
                  <MenuButton aria-label="Options">
                    <BsThreeDotsVertical className="cursor-pointer text-xl" />
                  </MenuButton>
                  <MenuList backgroundColor="#242526" border="none" padding="2">
                    <MenuItem
                      icon={<LiaEdit className="text-lg" />}
                      onClick={editHandler}
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: '#40404F',
                        borderRadius: '3px',
                      }}
                    >
                      <button
                        aria-label="delete post"
                        className="bg-none text-gray-400"
                      >
                        Edit Post
                      </button>
                    </MenuItem>
                    <MenuItem
                      icon={<CiTrash className="text-lg text-red-400" />}
                      onClick={() =>
                        handlePostDeletion(postId, postImage, imageRef)
                      }
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: '#40404F',
                        borderRadius: '3px',
                      }}
                    >
                      <button
                        aria-label="delete post"
                        className="bg-none text-gray-400"
                      >
                        Delete Post
                      </button>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </nav>
          </header>
        </div>
        {postImage && (
          <div className="pb-1">
            <FeedImage postImage={postImage} link={link} />
          </div>
        )}
        <div
          className={`mt-2 flex flex-col px-4 ${
            !postImage ? 'flex-col-reverse' : ''
          }`}
        >
          <div>
            <div className="flex items-center text-xl">
              <div className="flex flex-1 space-x-3">
                <section>
                  <span>
                    <button onClick={() => handleLikes(postId)}>
                      {hasLiked ? (
                        <FaHeart className="text-4xl text-red-500 group-hover:opacity-40" />
                      ) : (
                        <FiHeart className="text-4xl group-hover:opacity-40" />
                      )}
                    </button>
                  </span>
                </section>
                <section>
                  <span>
                    <button>
                      {/* <TbMessageCircle2 className="-scale-x-100 group-hover:opacity-40" /> */}
                    </button>
                  </span>
                </section>
                <section>
                  <span>
                    <button>
                      {/* <HiOutlinePaperAirplane className="rotate-90 group-hover:opacity-40" /> */}
                    </button>
                  </span>
                </section>
              </div>
              <section>
                <span>
                  <button>
                    {/* <FiBookmark className="group-hover:opacity-40" /> */}
                  </button>
                </span>
              </section>
            </div>

            <div>
              <span className="text-sm font-semibold xl:text-lg">
                {likes} likes
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {link && !postImage && (
              <div role="link" className="flex justify-start">
                <div className="inline-block cursor-pointer rounded-full bg-slate-600 p-2 opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-80">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <BiLink className="text-4xl" />
                  </a>
                </div>
              </div>
            )}
            <p
              className={`leading-8 ${
                postImage ? 'text-lg xl:text-xl' : 'text-2xl'
              }`}
            >
              {postTitle}
            </p>
            <div className="pb-2">
              <Collapse startingHeight={23} in={show}>
                <p className="text-[0.9rem]">
                  <span className="mr-2 font-semibold tracking-wide">
                    {username}
                  </span>
                  <span>{description}</span>
                </p>
              </Collapse>
              {description.length > 30 && (
                <div role="button">
                  <Text
                    className="inline-block text-base font-bold text-gray-400"
                    onClick={setShow.toggle}
                  >
                    Show {show ? 'Less' : 'More'}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default Feed;
