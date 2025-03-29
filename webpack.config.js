const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native',
        'react-native-reanimated',
        'react-native-gesture-handler',
      ],
    },
  }, argv);

  // Add aliases for native modules
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-reanimated': 'react-native-web/dist/vendor/reanimated',
    'react-native-gesture-handler': 'react-native-web/dist/vendor/react-native-gesture-handler',
  };

  // Ensure proper fallbacks
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
    'react-native/Libraries/Components/View/ViewNativeComponent': false,
    'react-native/Libraries/Image/AssetRegistry': false,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
  };

  return config;
}; 