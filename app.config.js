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
  platforms: ["ios", "android", "web"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.alekivatu.amoodatingapp"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.alekivatu.amoodatingapp"
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "webpack",
    output: "single",
    build: {
      babel: {
        include: ["@ui-kitten/components"]
      }
    }
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
}; 