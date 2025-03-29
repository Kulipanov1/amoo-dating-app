module.exports = {
  name: "Amoo Dating App",
  slug: "amoo-dating-app",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    }
  },
  web: {
    bundler: "webpack"
  }
}; 