import Link from 'next/link';

export default function PrivacyPolicyEN() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🛡️ PortfolYO Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last Updated: December 20, 2024 | Version: 1.0</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Overview</h2>
          <p className="text-gray-700 mb-4">
            PortfolYO (&quot;we&quot;, &quot;our&quot;, &quot;platform&quot;), is committed to
            protecting the privacy of our users. This Privacy Policy explains how your personal data
            is collected, used, and protected.
          </p>
          <p className="text-gray-700">
            This policy has been prepared in accordance with the GDPR (General Data Protection
            Regulation) and other applicable data protection laws.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎯 Data Collection</h2>

          <h3 className="text-xl font-medium text-gray-800 mb-3">1. Data Collected Directly</h3>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Account Information</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Email address (via GitHub OAuth)</li>
            <li>GitHub username</li>
            <li>GitHub profile information (avatar, bio, etc.)</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Portfolio Data</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Portfolio content</li>
            <li>Project information</li>
            <li>CV files</li>
            <li>Customization settings</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">User Interactions</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Feedback and reviews</li>
            <li>Usage statistics</li>
            <li>Page visits</li>
            <li>Button clicks</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800 mb-3">
            2. Data Collected Automatically
          </h3>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Technical Data</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>IP address</li>
            <li>Browser information</li>
            <li>Operating system</li>
            <li>Device type</li>
            <li>Page load times</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-700 mb-2">Usage Data</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Pages visited</li>
            <li>Session durations</li>
            <li>Error reports</li>
            <li>Performance metrics</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🍪 Cookie Policy</h2>

          <h3 className="text-xl font-medium text-gray-800 mb-3">1. Types of Cookies</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Essential Cookies</h4>
              <p className="text-sm text-gray-600 mb-2">
                Necessary for the basic functions of the platform
              </p>
              <p className="text-xs text-gray-500">
                Duration: Session | Control: Cannot be disabled
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Analytics Cookies</h4>
              <p className="text-sm text-gray-600 mb-2">
                Usage statistics and performance analysis
              </p>
              <p className="text-xs text-gray-500">
                Duration: 3 months | Control: User consent required
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Feedback Cookies</h4>
              <p className="text-sm text-gray-600 mb-2">User feedback and surveys</p>
              <p className="text-xs text-gray-500">
                Duration: 6 months | Control: User consent required
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Third-Party Cookies</h4>
              <p className="text-sm text-gray-600 mb-2">GitHub OAuth, Sentry error tracking</p>
              <p className="text-xs text-gray-500">
                Duration: 1 year | Control: User consent required
              </p>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-3">2. Cookie Management</h3>
          <p className="text-gray-700 mb-4">Users can manage their cookie settings as follows:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Changing settings from the cookie consent banner</li>
            <li>
              Detailed management from the{' '}
              <Link href="/gdpr-settings" className="text-blue-600 hover:underline">
                GDPR Settings
              </Link>{' '}
              page
            </li>
            <li>Deleting cookies from browser settings</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎯 User Rights (GDPR)</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">1. Right to be Informed</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Learn what data is collected</li>
                <li>• Learn the purpose of data processing</li>
                <li>• Learn about data sharing</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">2. Right of Access</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access your personal data</li>
                <li>• Receive a copy of your data</li>
                <li>• Learn the details of processing</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">3. Right to Rectification</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Correct inaccurate data</li>
                <li>• Complete incomplete data</li>
                <li>• Update current information</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">4. Right to Erasure</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Delete your data completely</li>
                <li>• Close your account</li>
                <li>• Remove all your data</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">5. Right to Data Portability</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Export your data</li>
                <li>• Transfer to another platform</li>
                <li>• Receive in a standard format</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">6. Right to Object</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Object to data processing</li>
                <li>• Stop marketing emails</li>
                <li>• Object to automated decision-making</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📞 Contact</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Data Protection Officer</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> privacy@portfolyo.com
              </p>
              <p>
                <strong>Address:</strong> [Company Address]
              </p>
              <p>
                <strong>Phone:</strong> [Phone Number]
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-800 mb-3">GDPR Requests</h3>
            <p className="text-gray-700 mb-4">To exercise your GDPR rights:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Via the platform:</strong> Use the{' '}
                <Link href="/gdpr-settings" className="text-blue-600 hover:underline">
                  GDPR Settings
                </Link>{' '}
                page
              </li>
              <li>
                <strong>Via email:</strong> Write to privacy@portfolyo.com
              </li>
              <li>
                <strong>Via API:</strong> Use the /api/gdpr endpoint
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600">
            This Privacy Policy explains the data protection practices of the PortfolYO platform and
            protects user rights.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: December 20, 2024</p>
        </div>
      </div>
    </>
  );
}
