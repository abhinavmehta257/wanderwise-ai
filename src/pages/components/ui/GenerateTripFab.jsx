import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';

export default function GenerateTripFab() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/generate')}
      aria-label="Generate trip"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#21BCBE] text-white shadow-lg transition hover:bg-[#1aa5a7] hover:scale-105"
    >
      <Plus size={24} />
    </button>
  );
}
