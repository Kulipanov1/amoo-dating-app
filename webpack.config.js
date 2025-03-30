const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface': 'react-native-web/dist/index',
    'react-native/Libraries/ReactPrivate/ReactNativePrivateInitializeCore': 'react-native-web/dist/index',
    '../Components/AccessibilityInfo/legacySendAccessibilityEvent': 'react-native-web/dist/modules/AccessibilityInfo',
    '@react-native/assets/registry': 'react-native-web/dist/modules/AssetRegistry',
    '../Utilities/Platform': 'react-native-web/dist/exports/Platform',
    './Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.ios': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.android': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.win32': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.macos': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.web': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.native': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.ios.js': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.android.js': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.win32.js': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.macos.js': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.web.js': 'react-native-web/dist/exports/AccessibilityInfo',
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.native.js': 'react-native-web/dist/exports/AccessibilityInfo'
  };

  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'node_modules/@react-navigation'),
          path.resolve(__dirname, 'node_modules/react-native-reanimated'),
          path.resolve(__dirname, 'node_modules/react-native-maps'),
          path.resolve(__dirname, 'node_modules/react-native-screens'),
          path.resolve(__dirname, 'node_modules/react-native-safe-area-context'),
          path.resolve(__dirname, 'node_modules/@react-native-community'),
          path.resolve(__dirname, 'node_modules/react-native-gesture-handler'),
          path.resolve(__dirname, 'node_modules/@expo/vector-icons')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-private-property-in-object'
            ]
          }
        }
      }
    ]
  };

  return config;
}; 