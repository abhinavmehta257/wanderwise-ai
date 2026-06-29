import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function TripSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/trip/search?q=${encodeURIComponent(searchQuery)}`
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

  const navigateToTrip = (slug) => {
    setSuggestions([]);
    setIsOpen(false);
    router.push(`/trip/${slug}`);
  };

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(nextValue);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.label);
    navigateToTrip(suggestion.slug);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      event.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder="Search trips by destination or title..."
        autoComplete="off"
        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#181F23] outline-none focus:border-[#21BCBE] focus:ring-2 focus:ring-[#21BCBE]/20"
      />
      {isLoading && (
        <p className="mt-1 text-sm text-[#8C9094]">Searching...</p>
      )}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <li key={suggestion.slug}>
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
