import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { isVisibleProgressStep } from '../../../../utils/tripProgressPhases';

export default function TripGenerationProgress({
  jobId,
  destination,
  numberOfDays,
  instagramUserId,
  onComplete,
  onError,
}) {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Starting your trip plan');
  const [textOpacity, setTextOpacity] = useState(1);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  const hasCompletedRef = useRef(false);
  const lastStepRef = useRef('');

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);

  useEffect(() => {
    if (!jobId) return undefined;

    let isActive = true;

    const redirectToTrip = (slug) => {
      if (!slug || hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      setIsRedirecting(true);
      setStatusText('Opening your trip');
      setTextOpacity(1);

      onCompleteRef.current?.({ slug });

      router.replace(`/trip/${slug}`).catch(() => {
        window.location.assign(`/trip/${slug}`);
      });
    };

    const pollStatus = async () => {
      try {
        const response = await fetch(
          `/api/trip/status?jobId=${encodeURIComponent(jobId)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to fetch trip status');
        }

        if (!isActive) return;

        if (data.status === 'complete' && data.slug) {
          redirectToTrip(data.slug);
          return;
        }

        if (data.status === 'error') {
          onErrorRef.current?.(data.error || 'Trip generation failed');
          return;
        }

        if (isVisibleProgressStep(data.step) && data.step !== lastStepRef.current) {
          lastStepRef.current = data.step;
          const nextText = data.step.replace(/\.\.\.$/, '');

          setTextOpacity(0);
          window.setTimeout(() => {
            if (!isActive) return;
            setStatusText(nextText);
            setTextOpacity(1);
          }, 280);
        }
      } catch (error) {
        if (isActive) {
          onErrorRef.current?.(error.message);
        }
      }
    };

    pollStatus();
    const intervalId = window.setInterval(pollStatus, 1500);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [jobId, router]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-6 py-12">
      <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#181F23]">
          Building your {numberOfDays}-day trip
        </h1>
        <p className="mt-2 text-sm text-[#8C9094]">{destination}</p>

        <div className="mt-10 flex flex-col items-center gap-6">
          {!isRedirecting ? (
            <div
              className="h-14 w-14 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#21BCBE]"
              aria-hidden="true"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#21BCBE]/15 text-2xl">
              ✓
            </div>
          )}
          <p
            className="min-h-[1.5rem] text-base font-medium text-[#181F23] transition-opacity duration-500 ease-in-out"
            style={{ opacity: textOpacity }}
          >
            {statusText}
          </p>
        </div>

        <p className="mt-10 text-sm text-[#8C9094]">
          {isRedirecting
            ? 'Taking you to your itinerary now...'
            : instagramUserId
              ? "We'll also send the link to your Instagram DMs when it's ready."
              : 'Your trip will open automatically when it is ready.'}
        </p>
      </div>
    </div>
  );
}
