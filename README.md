# Amoo One

Мобильное приложение для общения с красивым анимированным интерфейсом.

## Возможности

- Чаты с поддержкой текстовых сообщений, фотографий и голосовых сообщений
- Анимированный фон с градиентом и плавающими фигурами
- Адаптивный дизайн для мобильных устройств и веб-версии
- Поддержка темной и светлой темы

## Технологии

- React Native + Expo
- TypeScript
- React Navigation
- Expo Linear Gradient
- Expo AV (для аудио)
- Expo Image Picker
- React Native Reanimated

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/amoo-one.git
cd amoo-one
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
# Для веб-версии
npm run web

# Для iOS
npm run ios

# Для Android
npm run android
```

## Структура проекта

```
amoo-one/
├── components/          # Переиспользуемые компоненты
├── navigation/         # Навигация приложения
├── screens/           # Экраны приложения
├── App.tsx           # Корневой компонент
├── babel.config.js   # Конфигурация Babel
├── metro.config.js   # Конфигурация Metro
├── package.json      # Зависимости и скрипты
├── tsconfig.json     # Конфигурация TypeScript
└── webpack.config.js # Конфигурация Webpack для веб-версии
```

## Лицензия

MIT 