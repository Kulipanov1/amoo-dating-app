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
    'react-native-reanimated': 'react-native-web',
    'react-native-gesture-handler': 'react-native-web/dist/modules/GestureHandler',
    '@react-native': 'react-native-web',
  };

  // Ensure proper fallbacks
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
    'react-native/Libraries/Components/View/ViewNativeComponent': false,
    'react-native/Libraries/Image/AssetRegistry': false,
  };

  return config;
}; 