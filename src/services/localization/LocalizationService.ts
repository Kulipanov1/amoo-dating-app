import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from '../../locales/en.json';
import ru from '../../locales/ru.json';

interface TranslationData {
  [key: string]: string | TranslationData;
}

export class LocalizationService {
  private static instance: LocalizationService;
  private i18n: I18n;
  private readonly LOCALE_STORAGE_KEY = '@app_locale';
  private readonly DEFAULT_LOCALE = 'ru';
  private readonly SUPPORTED_LOCALES = ['en', 'ru'];
  private translations = { en, ru };

  private constructor() {
    this.i18n = new I18n();
    this.i18n.translations = this.translations;
    this.i18n.defaultLocale = this.DEFAULT_LOCALE;
    this.i18n.locale = this.DEFAULT_LOCALE;
    this.i18n.enableFallback = true;
    this.initializeLocale();
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  private async initializeLocale(): Promise<void> {
    try {
      const savedLocale = await AsyncStorage.getItem(this.LOCALE_STORAGE_KEY);
      if (savedLocale && this.SUPPORTED_LOCALES.includes(savedLocale)) {
        this.i18n.locale = savedLocale;
      } else {
        const deviceLocale = Localization.locale.split('-')[0];
        this.i18n.locale = this.SUPPORTED_LOCALES.includes(deviceLocale)
          ? deviceLocale
          : this.DEFAULT_LOCALE;
        await AsyncStorage.setItem(this.LOCALE_STORAGE_KEY, this.i18n.locale);
      }
    } catch (error) {
      console.error('Error initializing locale:', error);
      this.i18n.locale = this.DEFAULT_LOCALE;
    }
  }

  public async changeLocale(locale: string): Promise<void> {
    try {
      if (!this.SUPPORTED_LOCALES.includes(locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
      }

      this.i18n.locale = locale;
      await AsyncStorage.setItem(this.LOCALE_STORAGE_KEY, locale);
    } catch (error) {
      console.error('Error changing locale:', error);
      throw error;
    }
  }

  public t(key: string, options?: object): string {
    try {
      return this.i18n.t(key, options) || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }

  public getCurrentLocale(): string {
    return this.i18n.locale;
  }

  public getSupportedLocales(): string[] {
    return this.SUPPORTED_LOCALES;
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
      return this.i18n.strftime(date, format || '%d %b %Y');
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleDateString();
    }
  }

  public formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.i18n.locale, options).format(number);
    } catch (error) {
      console.error('Number formatting error:', error);
      return number.toString();
    }
  }

  public formatCurrency(amount: number, currency: string = 'USD'): string {
    try {
      return new Intl.NumberFormat(this.i18n.locale, {
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