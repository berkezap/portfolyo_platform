import { Suspense } from 'react';
import SuccessPage from '@/components/stripe/SuccessPage';

function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
}

export default function CheckoutSuccessPage() {
  return <SuccessPageWrapper />;
}
