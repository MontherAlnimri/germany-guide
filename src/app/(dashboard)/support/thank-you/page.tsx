'use client';

import { useRouter } from 'next/navigation';
import { useDict } from '@/lib/i18n';

export default function ThankYouPage() {
  const dict = useDict();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6">💖</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {dict.support.tipThankYou}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Your support helps keep this guide free for thousands of migrants and students.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {dict.premium.returnToDashboard}
      </button>
    </div>
  );
}