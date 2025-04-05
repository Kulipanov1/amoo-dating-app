import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from '../../locales/en.json';
import ru from '../../locales/ru.json';
import es from '../../locales/es.json';
import de from '../../locales/de.json';
import fr from '../../locales/fr.json';

interface TranslationData {
  [key: string]: string | TranslationData;
}

export class LocalizationService {
  private static instance: LocalizationService;
  private i18n: I18n;
  private readonly LOCALE_STORAGE_KEY = '@app_locale';
  private readonly DEFAULT_LOCALE = 'ru';
  private readonly SUPPORTED_LOCALES = ['en', 'ru'];

  private constructor() {
    this.i18n = new I18n({
      en,
      ru
    });

    this.i18n.defaultLocale = this.DEFAULT_LOCALE;
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
    return this.i18n.t(key, options);
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
    return this.i18n.strftime(date, format || '%d %b %Y');
  }

  public formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.i18n.locale, options).format(number);
  }

  public formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.i18n.locale, {
      style: 'currency',
      currency
    }).format(amount);
  }

  public getTextDirection(): 'ltr' | 'rtl' {
    return 'ltr';
  }
} 