const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Добавляем алиасы для react-native модулей
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface.web': 'react-native-web/dist/modules/ReactNativePrivateInterface',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/View/ViewStylePropTypes',
    'react-native/Libraries/Components/View/ViewNativeComponent': 'react-native-web/dist/exports/View/ViewNativeComponent',
    'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
    'react-native/Libraries/vendor/emitter/EventEmitter': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
  };

  // Добавляем fallback для модулей, которые не нужны в web
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/ReactPrivate/ReactNativePropRegistry': false,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
  };

  return config;
}; 