'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FeatureLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description: string;
}

export default function FeatureLockedModal({
  isOpen,
  onClose,
  feature,
  description,
}: FeatureLockedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v3m0-3h3m-3 0h-3m9-6a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">🔒 {feature} is Pro Feature</h3>

          <p className="text-gray-600 mb-6">{description}</p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">With Pro Plan you get:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Up to 5 Portfolios</li>
              <li>✓ Custom Domain Support</li>
              <li>✓ Premium Templates</li>
              <li>✓ Analytics Dashboard</li>
              <li>✓ Email Support</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Maybe Later
            </button>
            <Link
              href="/pricing"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 text-center font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              ✨ Upgrade Now - $5/mo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
