'use client';

import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 relative z-10">
      <div className="container mx-auto px-6 pt-16 pb-16">
        <div className="grid md:grid-cols-3 gap-16">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6 mt-12">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-white">PortfolYO</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              GitHub projelerinizi birkaç tıkla profesyonel portfolyoya dönüştürün. 
              Geliştiriciler için tasarlanmış modern platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/berkezap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:berke@portfolyo.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-6 mt-12">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/my-portfolios"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Portfolyolarım
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Fiyatlandırma
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-white font-semibold mb-6 mt-12">Yasal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr-settings"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Veri Koruma
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} PortfolYO. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0 text-xs text-gray-500">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>by</span>
            <a 
              href="https://github.com/berkezap" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              berkezap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
