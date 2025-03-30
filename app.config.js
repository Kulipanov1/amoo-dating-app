export default {
  name: 'Amoo one',
  slug: 'amoo-one',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
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
    package: 'com.amoo.datingapp'
  },
  web: {
    bundler: 'webpack'
  }
}; 