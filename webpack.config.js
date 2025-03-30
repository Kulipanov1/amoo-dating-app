const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add SVG support
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack']
  });

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-maps': 'react-native-web-maps',
    '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage',
    'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface': 'react-native-web/dist/index',
    'react-native/Libraries/ReactPrivate/ReactNativePrivateInitializeCore': 'react-native-web/dist/index',
    '../Components/AccessibilityInfo/legacySendAccessibilityEvent': 'react-native-web/dist/modules/AccessibilityInfo',
    '@react-native/assets/registry': 'react-native-web/dist/modules/AssetRegistry',
    '../Utilities/Platform': 'react-native-web/dist/exports/Platform',
    './Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform'
  };

  // Add support for Expo vector icons
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'fonts/'
    }
  });

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