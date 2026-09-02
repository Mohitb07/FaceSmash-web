import Link from 'next/link';
import React from 'react';
import { BiEnvelope, BiLockAlt, BiShieldQuarter } from 'react-icons/bi';
import {
  FiArrowLeft,
  FiCode,
  FiCompass,
  FiHeart,
  FiUsers,
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

import Brand from '@/components/Brand';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const AboutPage = () => {
  return (
    <Main
      meta={
        <Meta
          title="About FaceSmash — Modern Social Networking"
          description="Learn more about FaceSmash, our mission, privacy-first technology stack, and community standards."
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
          {/* Mission Card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <FiCompass className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">Our Mission</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              FaceSmash is a next-generation social network built for genuine
              interaction, real-time discussions, and creative media sharing. We
              strive to provide a clean, distraction-free environment without
              intrusive advertising, dark patterns, or bloated algorithms.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiUsers className="text-xl" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">
                Community First
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Follow people you care about, build genuine circles, and
                discover trending ideas from active creators.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <BiLockAlt className="text-xl" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">
                Privacy Focused
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Your credentials and private data remain strictly encrypted with
                verified authentication and secure cloud storage.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiCode className="text-xl" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">
                Modern Engineering
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Built on top of Next.js, Firebase Auth, Google Firestore, and
                Cloudinary CDN for lightning-fast media delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                <FiHeart className="text-xl" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">
                Verified Identity
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Every account goes through email verification to maintain
                spam-free feeds and authentic community engagement.
              </p>
            </div>
          </div>

          {/* Architecture / How We Store Your Data */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <BiShieldQuarter className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">
                How We Store Your Information
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              <li className="flex items-start gap-2">
                <MdVerified className="mt-0.5 shrink-0 text-base text-zinc-400" />
                <span>
                  <strong>User Profiles & Posts:</strong> Stored securely in
                  Google Cloud Firestore with granular per-user security rules
                  and automatic backups.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MdVerified className="mt-0.5 shrink-0 text-base text-zinc-400" />
                <span>
                  <strong>Media & Uploads:</strong> Media files are
                  cryptographically signed using authenticated server routes and
                  served across a fast global Cloudinary CDN.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MdVerified className="mt-0.5 shrink-0 text-base text-zinc-400" />
                <span>
                  <strong>Zero Third-Party Tracking:</strong> We do not sell
                  user data, track personal browsing habits, or license your
                  content to advertisers.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Queries */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <BiEnvelope className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">
                Questions or Inquiries?
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              For any questions, business inquiries, partnership requests, or
              feedback regarding FaceSmash, please contact us directly at:
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

export default AboutPage;
