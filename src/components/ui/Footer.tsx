'use client';

import Link from 'next/link';
import { Github, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900 text-gray-300 border-t border-gray-800"
      style={{ marginTop: '120px' }}
    >
      <div className="container mx-auto px-6" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold text-white">PortfolYO</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              GitHub projelerinizden otomatik olarak profesyonel portfolio website&apos;leri
              oluşturun. Geliştiriciler için tasarlanmış modern platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/portfolyo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="mailto:support@portfolyo.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/my-portfolios"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Portfolyolarım
                </Link>
              </li>
              <li>
                <Link
                  href="/consent-test"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Test Sayfası
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr-settings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GDPR Ayarları
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr-settings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Veri Koruma
                </Link>
              </li>
              <li>
                <a
                  href="mailto:privacy@portfolyo.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} PortfolYO. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Gizlilik
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Şartlar
            </Link>
            <a
              href="mailto:support@portfolyo.com"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Destek
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
