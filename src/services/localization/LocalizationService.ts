import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { ru } from './translations/ru';
import { en } from './translations/en';

const i18n = new I18n({
  en,
  ru,
});

i18n.defaultLocale = 'ru';
i18n.locale = Localization.locale || 'ru';
i18n.enableFallback = true;

class LocalizationService {
  private static instance: LocalizationService;
  private readonly LANGUAGE_KEY = 'user_language';

  private constructor() {
    this.initializeLanguage();
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  private async initializeLanguage() {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  public setLanguage(language: string) {
    i18n.locale = language;
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  public getLanguage(): string {
    return i18n.locale;
  }

  public translate(key: string, options?: object): string {
    return i18n.t(key, options);
  }

  public getCurrentLocale(): string {
    return i18n.locale;
  }

  public getSupportedLocales(): string[] {
    return ['en', 'ru'];
  }

  public getLocaleDisplayName(locale: string): string {
    const localeNames: { [key: string]: string } = {
      en: 'English',
      ru: 'Русский'
    };
    return localeNames[locale] || locale;
  }

  public formatDate(date: Date, format?: string): string {
    try {
      return i18n.strftime(date, format || '%d %b %Y');
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleDateString();
    }
  }

  public formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(i18n.locale, options).format(number);
    } catch (error) {
      console.error('Number formatting error:', error);
      return number.toString();
    }
  }

  public formatCurrency(amount: number, currency: string = 'USD'): string {
    try {
      return new Intl.NumberFormat(i18n.locale, {
        style: 'currency',
        currency
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${amount} ${currency}`;
    }
  }

  public getTextDirection(): 'ltr' | 'rtl' {
    return 'ltr';
  }
}

export default LocalizationService.getInstance(); 