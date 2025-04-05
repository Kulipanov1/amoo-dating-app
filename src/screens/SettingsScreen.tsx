import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalization } from '../contexts/LocalizationContext';
import { LanguageSelector } from '../components/LanguageSelector';

export const SettingsScreen: React.FC = () => {
  const { t } = useLocalization();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <LanguageSelector style={styles.languageSelector} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        {/* Add notification settings here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.privacy')}</Text>
        {/* Add privacy settings here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        {/* Add account settings here */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.help')}</Text>
        {/* Add help and support options here */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  languageSelector: {
    marginTop: 10,
  },
}); 