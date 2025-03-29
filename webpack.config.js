const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@react-native']
    }
  }, argv);

  // Customize the config before returning it.
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '../Utilities/Platform': '@react-native/Libraries/Utilities/Platform'
    }
  };

  return config;
}; 