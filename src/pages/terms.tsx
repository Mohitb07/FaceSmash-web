import Link from 'next/link';
import React from 'react';
import {
  BiCheckCircle,
  BiEnvelope,
  BiShieldAlt,
  BiXCircle,
} from 'react-icons/bi';
import { FiAlertCircle, FiArrowLeft, FiUserX } from 'react-icons/fi';

import Brand from '@/components/Brand';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const TermsPage = () => {
  return (
    <Main
      meta={
        <Meta
          title="Terms and Conditions — FaceSmash"
          description="Read the terms and conditions governing the use of the FaceSmash community and media platform."
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
              Terms & Conditions
            </h1>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Last revised: September 2026 • Please read carefully
            </p>
          </div>

          {/* Agreement Notice */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                Acceptance of Terms
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              By creating an account, browsing, or publishing content on
              FaceSmash, you agree to comply with and be bound by these Terms
              and Conditions. If you disagree with any portion of these terms,
              you must discontinue your use of our platform.
            </p>
          </div>

          {/* Terms Articles */}
          <div className="space-y-6 text-zinc-300">
            {/* 1. Eligibility and Registration */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <BiCheckCircle className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  1. Account Eligibility & Verification
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                You must provide a valid email address and complete email
                verification to unlock interactive platform features. You are
                solely responsible for safeguarding your login credentials and
                for all activities that occur under your account.
              </p>
            </div>

            {/* 2. User Content & Intellectual Property */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <BiShieldAlt className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  2. Content Ownership & License
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                You retain all intellectual property rights to the titles,
                captions, links, and photographs you post on FaceSmash. By
                publishing content, you grant FaceSmash a non-exclusive,
                royalty-free license solely to display, host, and distribute
                your content to other users on the platform.
              </p>
            </div>

            {/* 3. Prohibited Conduct */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <BiXCircle className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  3. Community Standards & Prohibited Conduct
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                <li>
                  • No hate speech, harassment, bullying, or targeted
                  defamation.
                </li>
                <li>
                  • No illegal content, non-consensual imagery, or copyright
                  infringement.
                </li>
                <li>
                  • No automated spam, scraping, or attempts to exploit platform
                  APIs or Cloudinary quotas.
                </li>
                <li>
                  • No impersonation of other individuals or organizations.
                </li>
              </ul>
            </div>

            {/* 4. Termination & Moderation */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <FiUserX className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  4. Account Suspension & Content Removal
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                FaceSmash reserves the right to review, restrict, or delete any
                content or terminate user accounts that violate our Community
                Standards, abuse platform storage, or present security risks to
                our users.
              </p>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131518] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <FiAlertCircle className="text-xl text-zinc-400" />
                <h3 className="text-base font-bold text-white">
                  5. Disclaimer & Limitation of Liability
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                FaceSmash is provided on an &quot;as-is&quot; and
                &quot;as-available&quot; basis without warranties of any kind.
                We are not liable for user-submitted content or service
                interruptions caused by third-party upstream providers.
              </p>
            </div>
          </div>

          {/* Legal Questions & Contact */}
          <div className="rounded-3xl border border-zinc-800/80 bg-[#131518] p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3 text-zinc-300">
              <BiEnvelope className="text-2xl text-zinc-300" />
              <h2 className="text-lg font-bold text-white">
                Legal & Terms Inquiries
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              For questions regarding these Terms and Conditions or to report a
              violation, reach out to our administration team:
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

export default TermsPage;
