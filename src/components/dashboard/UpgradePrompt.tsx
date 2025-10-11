'use client';

import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface UpgradePromptProps {
  currentPlan: 'FREE' | 'PRO';
  className?: string;
}

export default function UpgradePrompt({ currentPlan, className = '' }: UpgradePromptProps) {
  const t = useTranslations('dashboard');

  if (currentPlan !== 'FREE') return null;

  const handleWaitlistSignup = async () => {
    const email = prompt(
      '🚀 Get notified when Pro launches (Q2 2025):\n\n• 50% off first 3 months\n• Premium templates\n• Custom domains\n• Advanced analytics\n\nEnter your email:',
    );
    if (email && email.includes('@')) {
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, feature: 'pro', source: 'upgrade_prompt' }),
        });
        if (response.ok) {
          alert("🎉 Thanks! We'll notify you when Pro is ready with your early bird discount!");
        } else {
          alert('⚠️ Something went wrong, please try again later.');
        }
      } catch (error) {
        alert('⚠️ Something went wrong, please try again later.');
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
          {t('proComingSoon')}
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
            {t('quarter')}
          </span>
        </h3>
        <p className="text-xs text-gray-600">{t('proFeaturesDesc')}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-xs text-gray-500 line-through">$5{t('perMonth')}</span>
          <div className="text-xs font-medium text-blue-600">{t('discount3Months')}</div>
        </div>
        <Button onClick={handleWaitlistSignup} variant="primary" size="sm">
          {t('joinWaitlistBtn')}
        </Button>
      </div>
    </div>
  );
}
