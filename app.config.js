module.exports = {
  name: 'Amoo One',
  slug: 'amoo-one',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
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
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#8A2BE2'
    },
    package: 'com.amoo.datingapp'
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'webpack'
  }
}; 