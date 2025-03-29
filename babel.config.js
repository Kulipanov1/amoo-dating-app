module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'babel-plugin-react-native-web',
      '@babel/plugin-proposal-export-namespace-from',
    ],
  };
}; 