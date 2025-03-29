export default {
  name: 'Amoo Dating App',
  slug: 'amoo-dating-app',
  version: '1.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android', 'web'],
  userInterfaceStyle: 'light',
  splash: {
    backgroundColor: '#8A2BE2'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.amoo.datingapp'
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#8A2BE2'
    },
    package: 'com.amoo.datingapp'
  },
  web: {
    bundler: 'webpack'
  }
}; 