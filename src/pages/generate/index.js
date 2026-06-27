import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';

const DAY_PRESETS = [3, 5, 7];

function LocationAutocomplete({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/places/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setIsOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    onChange(nextValue);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(nextValue);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    onSelect(suggestion.value);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder="e.g. Paris, Bali, Tokyo"
        autoComplete="off"
        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#181F23] outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
        required
      />
      {isLoading && (
        <p className="mt-1 text-sm text-[#8C9094]">Searching...</p>
      )}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <li key={suggestion.value}>
              <button
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left text-sm text-[#181F23] hover:bg-[#F5F5F5]"
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const instagramUserId =
    typeof router.query.uid === 'string' ? router.query.uid : undefined;

  const [destination, setDestination] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState(5);
  const [customDays, setCustomDays] = useState('');
  const [isCustomDays, setIsCustomDays] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const numberOfDays = isCustomDays
    ? parseInt(customDays, 10)
    : selectedDays;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!destination.trim()) {
      setSubmitError('Please enter a destination.');
      return;
    }

    if (!numberOfDays || numberOfDays < 1 || numberOfDays > 30) {
      setSubmitError('Please choose a trip length between 1 and 30 days.');
      return;
    }

    if (!flexibleDates && !startDate) {
      setSubmitError('Please add a start date or choose flexible dates.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/trip/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramUserId,
          destination,
          numberOfDays,
          flexibleDates,
          startDate: flexibleDates ? undefined : startDate,
          endDate: flexibleDates ? undefined : endDate,
          creatorName,
          instagramHandle,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Trip submitted | Wanderwise</title>
        </Head>
        <NavBar />
        <div className="mx-auto min-h-[60vh] max-w-lg px-6 py-12 text-center">
          <div className="rounded-2xl bg-[#F0FDFA] px-6 py-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#21BCBE]/15 text-2xl">
              ✈️
            </div>
            <h1 className="text-2xl font-bold text-[#181F23]">
              We&apos;re generating your trip!
            </h1>
            <p className="mt-4 text-[#4B5563]">
              {instagramUserId
                ? "Hang tight — we'll send the link to your Instagram DMs once it's ready."
                : 'Hang tight — your itinerary is being created. Check back on wanderwise.ai shortly.'}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Plan a Trip | Wanderwise</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NavBar />
      <div className="mx-auto max-w-lg px-4 py-6 pb-12 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#181F23] sm:text-3xl">
            Plan your trip
          </h1>
          <p className="mt-2 text-[#8C9094]">
            Tell us where you want to go and we&apos;ll build your itinerary.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#181F23]">
              Where do you want to go?
            </label>
            <LocationAutocomplete
              value={destination}
              onChange={setDestination}
              onSelect={setDestination}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#181F23]">
              When are you travelling?
            </label>
            <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E7EB] px-4 py-3">
              <input
                type="checkbox"
                checked={flexibleDates}
                onChange={(event) => setFlexibleDates(event.target.checked)}
                className="h-5 w-5 rounded border-[#D1D5DB] text-[#21BCBE] focus:ring-[#21BCBE]"
              />
              <span className="text-sm text-[#181F23]">My dates are flexible</span>
            </label>

            {!flexibleDates && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-[#8C9094]">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-base outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#8C9094]">
                    End date (optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    min={startDate || undefined}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-base outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#181F23]">
              How many days?
            </label>
            <div className="flex flex-wrap gap-2">
              {DAY_PRESETS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setSelectedDays(days);
                    setIsCustomDays(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    !isCustomDays && selectedDays === days
                      ? 'bg-[#21BCBE] text-white'
                      : 'bg-[#F5F5F5] text-[#181F23] hover:bg-[#EAEAEA]'
                  }`}
                >
                  {days} days
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomDays(true)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isCustomDays
                    ? 'bg-[#21BCBE] text-white'
                    : 'bg-[#F5F5F5] text-[#181F23] hover:bg-[#EAEAEA]'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomDays && (
              <input
                type="number"
                min="1"
                max="30"
                value={customDays}
                onChange={(event) => setCustomDays(event.target.value)}
                placeholder="Enter number of days"
                className="mt-3 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-base outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
              />
            )}
          </div>

          <div className="space-y-4 rounded-xl bg-[#FAFAFA] p-4">
            <p className="text-sm font-semibold text-[#181F23]">
              Tag this trip (optional)
            </p>
            <div>
              <label className="mb-1 block text-xs text-[#8C9094]">
                Your name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(event) => setCreatorName(event.target.value)}
                placeholder="How should we credit you?"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#8C9094]">
                Instagram handle
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(event) => setInstagramHandle(event.target.value)}
                placeholder="@yourusername"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
              />
            </div>
          </div>

          {submitError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#21BCBE] px-4 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Generate my trip'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
