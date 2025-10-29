import { Suspense } from 'react';
import ChatPage from '@/components/pages/ChatPage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatPage />
    </Suspense>
  );
}