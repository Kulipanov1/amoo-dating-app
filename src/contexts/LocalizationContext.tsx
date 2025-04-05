import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocalizationService } from '../services/localization/LocalizationService';

interface LocalizationContextType {
  t: (key: string, options?: object) => string;
  getCurrentLocale: () => string;
  changeLocale: (locale: string, userId?: string) => Promise<void>;
  getSupportedLocales: () => string[];
  getLocaleDisplayName: (locale: string) => string;
  formatDate: (date: Date, format?: string) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  getTextDirection: () => 'ltr' | 'rtl';
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const localizationService = LocalizationService.getInstance();

  const value: LocalizationContextType = {
    t: (key, options) => localizationService.t(key, options),
    getCurrentLocale: () => localizationService.getCurrentLocale(),
    changeLocale: (locale, userId) => localizationService.changeLocale(locale, userId),
    getSupportedLocales: () => localizationService.getSupportedLocales(),
    getLocaleDisplayName: (locale) => localizationService.getLocaleDisplayName(locale),
    formatDate: (date, format) => localizationService.formatDate(date, format),
    formatNumber: (number, options) => localizationService.formatNumber(number, options),
    formatCurrency: (amount, currency) => localizationService.formatCurrency(amount, currency),
    getTextDirection: () => localizationService.getTextDirection(),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}; 