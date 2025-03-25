module.exports = {
  name: "Amoo Dating App",
  slug: "amoo-dating-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "webpack",
    output: "static",
    publicPath: "/amoo-dating-app/"
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
}; 