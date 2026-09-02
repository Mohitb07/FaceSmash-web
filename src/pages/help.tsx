import Link from 'next/link';
import React, { useState } from 'react';
import {
  BiChevronDown,
  BiEnvelope,
  BiHelpCircle,
  BiSearch,
} from 'react-icons/bi';
import { FiArrowLeft, FiFileText, FiLock, FiUserCheck } from 'react-icons/fi';

import Brand from '@/components/Brand';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const FAQS: FAQItem[] = [
  {
    category: 'Account & Security',
    question: 'How do I verify my email address?',
    answer:
      'Upon signing up, FaceSmash sends a secure verification link to your registered email address. Click the link in your inbox to automatically verify your account. If you did not receive it, click "Resend Link" on the verification screen.',
  },
  {
    category: 'Account & Security',
    question: 'How do I reset my password?',
    answer:
      'On the login screen, click "Forgot Password". Enter your registered email address to receive a secure password reset link directly from Firebase Authentication.',
  },
  {
    category: 'Posts & Feed',
    question: 'How do I create and edit posts?',
    answer:
      'Click the "Create" button on the left sidebar or bottom navigation bar. Add a title, caption description, and optional photo or link. To edit an existing post, click the three dots (⋮) on the top right of your post and select "Edit Post".',
  },
  {
    category: 'Posts & Feed',
    question: 'How do image uploads work?',
    answer:
      'Images are uploaded directly to our secure Cloudinary Content Delivery Network (CDN) using signed authorization tokens, ensuring fast global delivery and automatic WebP optimization.',
  },
  {
    category: 'Privacy & Data',
    question: 'How do I delete my posts or data?',
    answer:
      'You can delete any of your own posts by clicking the three dots (⋮) menu on the post card and selecting "Delete Post". A confirmation prompt will verify your intent before permanently removing the post and its likes.',
  },
  {
    category: 'Privacy & Data',
    question: 'Who can see my profile and posts?',
    answer:
      'FaceSmash is a verified community platform. All verified logged-in users can browse public posts, view user bios, and follow other members.',
  },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Main
      meta={
        <Meta
          title="Help & Support Center — FaceSmash"
          description="Find answers to common questions about your FaceSmash account, post creation, and security."
        />
      }
    >
      {/* Standalone Brand Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-[#0C1014]/90 px-4 backdrop-blur-md sm:px-8">
        <Link href="/">
          <div className="cursor-pointer">
            <Brand />
          </div>
        </Link>
        <Link href="/">
          <button className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#131518] px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white active:scale-95">
            <FiArrowLeft className="text-base" />
            <span>Return to App</span>
          </button>
        </Link>
      </header>

      <main className="min-h-screen bg-[#0C1014] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Help & Support
            </h1>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Quick answers, guides, and assistance for FaceSmash
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics, FAQs, or troubleshooting..."
              className="w-full rounded-2xl border border-zinc-800 bg-[#131518] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40"
            />
          </div>

          {/* Quick Support Categories */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-[#131518] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiUserCheck className="text-xl" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Verification</h3>
                <p className="text-[11px] text-zinc-400">Email & Account</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-[#131518] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiFileText className="text-xl" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Posting</h3>
                <p className="text-[11px] text-zinc-400">Photos & Captions</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-[#131518] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Security</h3>
                <p className="text-[11px] text-zinc-400">Password & Data</p>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">
              Frequently Asked Questions
            </h2>
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-8 text-center text-zinc-400">
                <BiHelpCircle className="mx-auto text-4xl text-zinc-600" />
                <p className="mt-2 text-sm font-medium text-zinc-300">
                  No help articles found
                </p>
                <p className="text-xs text-zinc-500">
                  Try searching for a different keyword or contact us directly.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#131518] transition-all hover:border-zinc-700/80"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors sm:p-5"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          {faq.category}
                        </span>
                        <h3 className="text-sm font-semibold text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <BiChevronDown
                        className={`text-xl text-zinc-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-zinc-200' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-zinc-800/60 bg-[#0c1014]/60 p-4 text-xs leading-relaxed text-zinc-300 sm:p-5 sm:text-sm">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Need Help? Card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <BiEnvelope className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">
                Still Need Assistance?
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              Have a bug to report, questions about an account, or feature
              requests? Drop us an email and our team will get back to you
              promptly:
            </p>
            <a
              href="mailto:bmohit980@gmail.com"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-100 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary-100/30 transition-all hover:bg-primary-200 active:scale-95"
            >
              <BiEnvelope className="text-base text-white" />
              <span>bmohit980@gmail.com</span>
            </a>
          </div>
        </div>
      </main>
    </Main>
  );
};

export default HelpPage;
