import React from 'react';

export const SparkleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-[#8668D8]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

export const PetalSilhouette: React.FC<{ className?: string }> = ({ className = 'w-24 h-24 text-[#C3A6FF]/20' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 0C50 27.6 27.6 50 0 50C27.6 50 50 72.4 50 100C50 72.4 72.4 50 100 50C72.4 50 50 27.6 50 0Z" />
  </svg>
);

export const OrganicBranch: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 text-[#C3A6FF]' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 34C14 26 22 18 34 6" />
    <path d="M14 26C14 22 18 20 22 22C24 24 24 28 20 28C16 28 14 26 14 26Z" />
    <path d="M22 18C22 14 26 12 30 14C32 16 32 20 28 20C24 20 22 18 22 18Z" />
    <path d="M10 30C10 28 12 26 14 28" />
  </svg>
);
