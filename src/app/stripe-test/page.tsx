'use client';

import { useState } from 'react';

export default function StripeTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testStripeConnection = async () => {
    setLoading(true);
    try {
      // Test Stripe client initialization
      const { getStripe } = await import('@/lib/stripe/client');
      const stripe = await getStripe();

      if (stripe) {
        setResult('✅ Stripe Client başarıyla yüklendi!');
      } else {
        setResult('❌ Stripe Client yüklenemedi');
      }
    } catch (error) {
      setResult(`❌ Hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testStripeConfig = async () => {
    setLoading(true);
    try {
      // Test public key
      const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (publicKey && publicKey.startsWith('pk_test_')) {
        setResult(`✅ Stripe Public Key mevcut: ${publicKey.substring(0, 20)}...`);
      } else {
        setResult('❌ Stripe Public Key eksik veya hatalı');
      }
    } catch (error) {
      setResult(`❌ Hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCheckoutFlow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_test_123',
          planType: 'PRO',
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setResult('✅ Checkout API çalışıyor (401 Unauthorized beklenen - auth gerekiyor)');
      } else {
        setResult(`Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Hata: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Stripe Integration Test</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4 mb-8">
            <button
              onClick={testStripeConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : '1. Stripe Client Bağlantısını Test Et'}
            </button>

            <button
              onClick={testStripeConfig}
              disabled={loading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : '2. Stripe Configuration Test Et'}
            </button>

            <button
              onClick={testCheckoutFlow}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : '3. Checkout API Test Et'}
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Sonucu:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result || 'Henüz test yapılmadı'}</pre>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Test Kartları:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Başarılı ödeme:</strong> 4242424242424242
              </p>
              <p>
                <strong>Başarısız ödeme:</strong> 4000000000000002
              </p>
              <p>
                <strong>3D Secure gerekli:</strong> 4000002500003155
              </p>
              <p>
                <strong>Tarih:</strong> Gelecekte herhangi bir tarih (örn: 12/25)
              </p>
              <p>
                <strong>CVC:</strong> Herhangi 3 haneli numara (örn: 123)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
