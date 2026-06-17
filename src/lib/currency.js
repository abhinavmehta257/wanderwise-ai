const LOCALE_CURRENCY = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  JP: 'JPY',
  CA: 'CAD',
  AU: 'AUD',
  DE: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  MX: 'MXN',
  BR: 'BRL',
  KR: 'KRW',
  CN: 'CNY',
  SG: 'SGD',
  AE: 'AED',
  SA: 'SAR',
  EG: 'EGP',
  PK: 'PKR',
  BD: 'BDT',
  TH: 'THB',
  VN: 'VND',
  PH: 'PHP',
  MY: 'MYR',
  ID: 'IDR',
  NZ: 'NZD',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
  TR: 'TRY',
  ZA: 'ZAR',
  NG: 'NGN',
  KE: 'KES',
  AR: 'ARS',
  CL: 'CLP',
  CO: 'COP',
  PE: 'PEN',
};

export const COMMON_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF',
  'CNY', 'SGD', 'AED', 'SAR', 'EGP', 'MXN', 'BRL', 'KRW',
  'THB', 'MYR', 'IDR', 'PHP', 'NZD', 'SEK', 'NOK', 'ZAR',
];

export function getUserCurrency() {
  if (typeof window === 'undefined') return 'USD';
  const locale = navigator.language || 'en-US';
  const region = locale.split('-')[1]?.toUpperCase();
  return LOCALE_CURRENCY[region] || 'USD';
}

export function parseBudgetBreakdown(budgetBreakdown) {
  if (!budgetBreakdown) return { currency: 'USD', items: [] };

  const sourceCurrency = budgetBreakdown.currency || 'USD';
  const items = Object.entries(budgetBreakdown)
    .filter(([key, value]) => key !== 'currency' && value != null && value !== '')
    .map(([key, value]) => ({
      key,
      amount:
        typeof value === 'number'
          ? value
          : parseFloat(String(value).replace(/[^\d.]/g, '')) || 0,
    }));

  return { currency: sourceCurrency, items };
}

export function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}
