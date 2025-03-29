const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Отключаем gesture-handler для веб-версии
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-gesture-handler': false,
    'react-native-reanimated': false
  };

  return config;
}; 