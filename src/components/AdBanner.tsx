'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useDict } from '@/lib/i18n';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export default function AdBanner({ slot, format = 'horizontal', className = '' }: AdBannerProps) {
  const { isPremium, loading } = useSubscription();
  const dict = useDict();

  if (loading || isPremium) return null;

  const sizeClasses = {
    horizontal: 'h-[90px] w-full max-w-[728px]',
    vertical: 'w-[160px] h-[600px]',
    rectangle: 'w-[300px] h-[250px]',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`${sizeClasses[format]} bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center`}
      >
        {/* Replace this div with actual Google AdSense code when approved */}
        {/* 
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXX"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        */}
        <div className="text-center p-4">
          <p className="text-xs text-gray-400 mb-1">{dict.ads.advertisement}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🚀 Upgrade to Premium for an ad-free experience
          </p>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 mt-1">{dict.ads.sponsored}</span>
    </div>
  );
}