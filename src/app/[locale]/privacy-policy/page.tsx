'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeaderNew';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import { useLocale } from 'next-intl';
import PrivacyPolicyTR from '@/content/privacy-policy-tr';
import PrivacyPolicyEN from '@/content/privacy-policy-en';

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const Content = locale === 'tr' ? PrivacyPolicyTR : PrivacyPolicyEN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <DashboardHeader demoMode={false} variant="transparent" />
      <div style={{ paddingTop: '64px' }}>
        <Container>
          <div className="max-w-4xl mx-auto py-8">
            <Card className="p-8">
              <Content />
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
