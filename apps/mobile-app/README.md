# 🚀 Getting Started with React Native and TypeScript

This guide will walk you through setting up your environment for developing a React Native app with TypeScript.

## Prerequisites

Ensure you have the following installed on your machine:

- **NodeJS**: Version 16 or higher (Recommended to use `nvm` to manage multiple Node versions).
- **Ruby**: Version 2.7.5 (Recommended to use `rvm` to manage multiple Ruby versions).
- **CocoaPods**: Version 1.11.3 or newer.
- **Java SE Development Kit (JDK)**: Version 17 or higher (`brew install --cask zulu@17` on macOS).

## Initial Setup

Before you start coding, run the following commands:

```bash
yarn install
bundle install
cd ios/ && pod install
```

## Environment Setup

### macOS

Add the following to your `.zshrc` file:

```bash
export JAVA_HOME=$(/usr/libexec/java_home)
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

### Windows

(Add Windows-specific environment setup here)

## Folder Structure

```

```

## Development

To start the Android application:

```bash
npm run android
# or
yarn android
```

To start the iOS application:

```bash
npm run ios
# or
yarn ios
```

## Testing

Run tests with:

```bash
npm run test
# or
yarn test
```

## Linting

Check code for errors and warnings:

```bash
npm run lint
# or
yarn lint
```

## Firebase Setup

### Debug Certificate

To use Firebase with your app (required for Dynamic Links, Invites, and Phone Authentication), you need to generate a debug signing certificate:

1. Run: `cd android && ./gradlew signingReport`
2. Copy both `SHA1` and `SHA-256` keys from the `debugAndroidTest` variant.
3. Add these keys to the "SHA certificate fingerprints" in your Firebase console.

Example output:

```
Variant: debugAndroidTest
Config: debug
Store: /Users/username/path/to/project/android/app/debug.keystore
Alias: androiddebugkey
MD5: 20:F4:61:48:B7:2D:8E:5E:5C:A2:3D:37:A4:F4:14:90
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
Valid until: Wednesday, May 1, 2052
```

## Additional Resources

- [React Native Firebase](https://rnfirebase.io/)
- [Configuring Crashlytics for React Native Firebase](https://invertase.io/blog/react-native-firebase-crashlytics-configuration)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Saga Tutorial](https://redux-saga.js.org/docs/introduction/BeginnerTutorial)
- [React Native 0.73 Debugging Improvements](https://reactnative.dev/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#java-17-and-android-gradle-plugin-upgrade)
