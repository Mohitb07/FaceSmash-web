import Link from 'next/link';
import React from 'react';
import { BiEnvelope, BiServer, BiUserCheck } from 'react-icons/bi';
import { FiArrowLeft, FiEyeOff, FiTrash2 } from 'react-icons/fi';

import Brand from '@/components/Brand';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const PrivacyPage = () => {
  return (
    <Main
      meta={
        <Meta
          title="Privacy Policy — FaceSmash"
          description="Understand how FaceSmash collects, safeguards, and respects your personal data and uploaded content."
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
              Privacy Policy
            </h1>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Last updated: September 2026 • Effective immediately
            </p>
          </div>

          {/* Introduction Card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                Our Privacy Commitment
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              At FaceSmash, we believe your privacy is a fundamental human
              right. We do not sell your personal information, display intrusive
              tracking advertisements, or profile your activity for commercial
              brokerages. This Privacy Policy details what data we collect, how
              it is secured, and your rights as a member.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6 text-zinc-300">
            {/* Section 1: Information We Collect */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <BiUserCheck className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  1. Information We Collect
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                <li>
                  • <strong>Account Credentials:</strong> Email address,
                  encrypted authentication tokens (via Firebase Auth), display
                  name, and unique handle.
                </li>
                <li>
                  • <strong>Profile Details:</strong> Optional bio description
                  and avatar profile photo.
                </li>
                <li>
                  • <strong>Published Content:</strong> Post titles, caption
                  descriptions, shared URLs, and uploaded images.
                </li>
                <li>
                  • <strong>Social Graph:</strong> Posts you like, users you
                  follow, and members who follow you.
                </li>
              </ul>
            </div>

            {/* Section 2: How We Store & Secure Your Data */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <BiServer className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  2. Storage & Security Architecture
                </h3>
              </div>
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                <p>
                  • <strong>Firestore Database:</strong> Your profile and posts
                  are stored in Google Cloud Firestore with strict token-based
                  security rules ensuring users can only edit or delete their
                  own data.
                </p>
                <p>
                  • <strong>Cloudinary Media CDN:</strong> Uploaded images are
                  authenticated using server-side HMAC SHA-1 signatures,
                  preventing unauthorized bucket access and optimizing media
                  delivery.
                </p>
              </div>
            </div>

            {/* Section 3: Data Ownership & Deletion Rights */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <FiTrash2 className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  3. Your Data Deletion Rights
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                You maintain full ownership of your content. You have the right
                to edit or permanently delete any post at any time directly
                through the app. Deleting a post removes it and its likes from
                the active database immediately.
              </p>
            </div>

            {/* Section 4: Cookies & Analytics */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <FiEyeOff className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  4. Cookies & Third Parties
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                We use essential session cookies strictly to keep you securely
                signed in to your account. We do not use third-party marketing
                cookies or sell your browsing footprint to advertisers.
              </p>
            </div>
          </div>

          {/* Privacy Questions Contact */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <BiEnvelope className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">
                Privacy Officer & Inquiries
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              If you have questions about your privacy, wish to exercise your
              data rights, or request account information deletion, contact us
              at:
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

export default PrivacyPage;
