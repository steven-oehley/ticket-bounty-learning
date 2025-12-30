import { MyBig } from '@/lib/big';

export const toCurrencyFromCents = (cents: number): number => {
  return MyBig(cents).div(100).round(2).toNumber();
};

export const toCentsFromCurrency = (currency: number): number => {
  return MyBig(currency).mul(100).round(2).toNumber();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(toCurrencyFromCents(amount));
};
