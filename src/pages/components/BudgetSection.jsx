import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import {
  parseBudgetBreakdown,
  getUserCurrency,
  formatCurrency,
  COMMON_CURRENCIES,
} from '../../lib/currency';

const BudgetSection = ({ budgetBreakdown }) => {
  const { currency: sourceCurrency, items } = parseBudgetBreakdown(budgetBreakdown);
  const [showConverted, setShowConverted] = useState(false);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTargetCurrency(getUserCurrency());
  }, []);

  const fetchRate = useCallback(async (from, to) => {
    if (from === to) {
      setRate(1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get('/api/currency/convert', {
        params: { from, to },
      });
      setRate(data.rate);
    } catch {
      setError('Could not fetch exchange rate. Please try again.');
      setShowConverted(false);
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showConverted) {
      fetchRate(sourceCurrency, targetCurrency);
    }
  }, [showConverted, sourceCurrency, targetCurrency, fetchRate]);

  const handleToggle = () => {
    setShowConverted((prev) => !prev);
    if (showConverted) {
      setRate(null);
      setError(null);
    }
  };

  const handleCurrencyChange = (event) => {
    setTargetCurrency(event.target.value);
    setRate(null);
  };

  if (!items.length) return null;

  const displayAmount = (amount) => {
    if (showConverted && rate != null) {
      return formatCurrency(amount * rate, targetCurrency);
    }
    return formatCurrency(amount, sourceCurrency);
  };

  return (
    <div className="space-y-2 border-t mt-[28px]">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full text-left mt-4 group"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[24px] font-bold text-black">Budget</h2>
            <p className="text-sm text-gray-500 mt-1 group-hover:text-[#21BCBE] transition-colors">
              {showConverted
                ? `Showing in ${targetCurrency} · Click to view original (${sourceCurrency})`
                : `Click to view in your currency (${targetCurrency})`}
            </p>
          </div>
          <span
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              showConverted ? 'bg-[#21BCBE] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#21BCBE]/10 group-hover:text-[#21BCBE]'
            }`}
          >
            <SwapHorizOutlinedIcon fontSize="small" />
          </span>
        </div>
      </button>

      {showConverted && (
        <div className="flex items-center gap-2 pb-2">
          <label htmlFor="budget-currency" className="text-sm text-gray-600">
            Convert to
          </label>
          <select
            id="budget-currency"
            value={targetCurrency}
            onChange={handleCurrencyChange}
            className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white text-black"
          >
            {COMMON_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500 py-2">Fetching exchange rate...</p>
      )}

      {error && <p className="text-sm text-red-500 py-2">{error}</p>}

      {!loading &&
        items.map(({ key, amount }, index) => (
          <div key={key}>
            <div className="flex justify-between items-center">
              <span className="capitalize text-black">{key.replace(/_/g, ' ')}</span>
              <span
                className={`font-semibold transition-colors ${
                  showConverted ? 'text-[#21BCBE]' : 'text-black'
                }`}
              >
                {showConverted && rate == null ? '...' : displayAmount(amount)}
              </span>
            </div>
            {index < items.length - 1 && <hr className="my-2" />}
          </div>
        ))}

      {showConverted && rate != null && sourceCurrency !== targetCurrency && (
        <p className="text-xs text-gray-400 pt-1">
          1 {sourceCurrency} ≈ {rate.toFixed(4)} {targetCurrency}
        </p>
      )}
    </div>
  );
};

export default BudgetSection;
