module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '~shared-universal': '../../packages/shared-universal/src',
          '~react-native-design-system': '../../packages/react-native-design-system/src',
          '~react-native-ui-core': '../../packages/react-native-ui-core/src',
        },
      },
    ],
  ],
};
