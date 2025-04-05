import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocalizationService } from '../services/localization/LocalizationService';

interface LocalizationContextType {
  t: (key: string, options?: object) => string;
  locale: string;
  changeLocale: (newLocale: string, userId?: string) => Promise<void>;
  formatDate: (date: Date, format?: string) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  textDirection: 'ltr' | 'rtl';
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const localizationService = LocalizationService.getInstance();
  const [locale, setLocale] = useState(localizationService.getCurrentLocale());

  useEffect(() => {
    // Инициализация локали при монтировании компонента
    const initLocale = async () => {
      try {
        setLocale(localizationService.getCurrentLocale());
      } catch (error) {
        console.error('Error initializing locale:', error);
      }
    };

    initLocale();
  }, []);

  const changeLocale = async (newLocale: string, userId?: string) => {
    try {
      await localizationService.changeLocale(newLocale, userId);
      setLocale(newLocale);
    } catch (error) {
      console.error('Error changing locale:', error);
      throw error;
    }
  };

  const value = {
    t: (key: string, options?: object) => localizationService.t(key, options),
    locale,
    changeLocale,
    formatDate: (date: Date, format?: string) => localizationService.formatDate(date, format),
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) => 
      localizationService.formatNumber(number, options),
    formatCurrency: (amount: number, currency?: string) => 
      localizationService.formatCurrency(amount, currency),
    textDirection: localizationService.getTextDirection(),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}; 