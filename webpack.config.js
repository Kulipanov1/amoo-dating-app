const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native',
        'react-native-web',
        'react-native-reanimated',
        'react-native-gesture-handler'
      ]
    }
  }, argv);

  // Customize the config before returning it.
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native': 'react-native-web',
      'react-native-web': path.resolve(__dirname, './node_modules/react-native-web'),
      '@react-native': path.resolve(__dirname, './node_modules/react-native'),
      // Explicitly alias Platform utility
      '../Utilities/Platform': path.resolve(__dirname, './node_modules/react-native-web/dist/exports/Platform'),
      './Platform': path.resolve(__dirname, './node_modules/react-native-web/dist/exports/Platform'),
      // Add aliases for animated components
      'react-native-reanimated': 'react-native-reanimated/lib/reanimated2/core',
      'react-native-gesture-handler': 'react-native-web/dist/modules/GestureHandler'
    },
    fallback: {
      ...config.resolve.fallback,
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  };

  return config;
}; 