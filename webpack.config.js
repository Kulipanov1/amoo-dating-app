const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Настраиваем правильные алиасы для react-native модулей
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-maps': 'react-native-web-maps',
    '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage',
    'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/View/ViewStylePropTypes',
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
    'react-native/Libraries/vendor/emitter/EventEmitter': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
    'react-native/Libraries/Components/UnimplementedViews/UnimplementedView': 'react-native-web/dist/modules/UnimplementedView',
    'react-native/Libraries/Image/AssetSourceResolver': 'react-native-web/dist/modules/AssetSourceResolver',
    'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
    'react-native/Libraries/Image/resolveAssetSource': 'react-native-web/dist/exports/Image/resolveAssetSource',
    'react-native/Libraries/Core/Devtools/getDevServer': 'react-native-web/dist/modules/getDevServer',
    'react-native/Libraries/Core/Devtools/setupDevtools': 'react-native-web/dist/modules/setupDevtools',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
  };

  // Добавляем fallback для модулей, которые не нужны в web
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/ReactPrivate/ReactNativePropRegistry': false,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo': false,
    fs: false,
    net: false,
    tls: false,
  };

  return config;
}; 