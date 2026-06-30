import { useState } from 'react';
import { useRouter } from 'next/router';
import { Check, Share2 } from 'lucide-react';

export default function ShareButton({ title, text }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${router.asPath}`
        : '';

    const shareData = {
      title: title || 'Wanderwise trip',
      text: text || '',
      url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied' : 'Share trip'}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#181F23] transition-colors hover:bg-[#F5F5F5]"
    >
      {copied ? <Check size={16} className="text-[#21BCBE]" /> : <Share2 size={16} />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
