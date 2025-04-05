import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LocalizationService } from '../services/localization/LocalizationService';

interface LanguageSelectorProps {
  onLanguageChange?: (locale: string) => void;
  style?: object;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange, style }) => {
  const localizationService = LocalizationService.getInstance();
  const currentLocale = localizationService.getCurrentLocale();
  const supportedLocales = localizationService.getSupportedLocales();

  const handleLanguageChange = async (locale: string) => {
    try {
      await localizationService.changeLocale(locale);
      onLanguageChange?.(locale);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {supportedLocales.map((locale) => (
        <TouchableOpacity
          key={locale}
          style={[
            styles.languageButton,
            currentLocale === locale && styles.activeLanguageButton
          ]}
          onPress={() => handleLanguageChange(locale)}
        >
          <Text
            style={[
              styles.languageText,
              currentLocale === locale && styles.activeLanguageText
            ]}
          >
            {localizationService.getLocaleDisplayName(locale)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeLanguageButton: {
    backgroundColor: '#8A2BE2',
    borderColor: '#8A2BE2',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 