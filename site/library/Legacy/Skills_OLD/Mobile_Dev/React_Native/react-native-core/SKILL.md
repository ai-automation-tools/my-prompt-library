---
title: "🔧 React Native Core Development"
tags: ["skill", "mobile", "react-native", "javascript"]
category: "Skills"
subcategory: "Mobile_Dev"
name: react-native-core
description: "Build cross-platform mobile apps with React Native. Use when: (1) need iOS + Android from single codebase, (2) team has JavaScript/React experience, (3) want hot-reload development. NOT for: games, AR/VR apps, or performance-critical native features."
---

# React Native Core Development

Build production-quality iOS and Android applications using React Native, leveraging JavaScript/TypeScript and native modules for cross-platform mobile development.

## Prerequisites

- **Node.js:** v18+ (LTS recommended)
- **npm/yarn:** Latest version
- **React Native CLI:** `npm install -g react-native-cli`
- **Xcode:** (macOS only) Latest from App Store for iOS development
- **Android Studio:** Latest version for Android development
- **CocoaPods:** (macOS only) `sudo gem install cocoapods`

### Setup Instructions

1. Install React Native CLI:
   ```bash
   npm install -g react-native-cli
   ```

2. Create new project:
   ```bash
   npx react-native init MyApp --template react-native-template-typescript
   cd MyApp
   ```

3. Install iOS dependencies (macOS):
   ```bash
   cd ios && pod install && cd ..
   ```

**Verification:**
```bash
npx react-native doctor
```

Expected output:
```
✓ Node.js
✓ React Native CLI
✓ Android SDK
✓ Xcode (macOS)
```

## Usage

### Basic Usage

Run development server:
```bash
npm start
# or
yarn start
```

Run on iOS:
```bash
npx react-native run-ios
# Specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

Run on Android:
```bash
npx react-native run-android
```

### Common Workflows

#### Workflow 1: Component Development

**Steps:**
1. Create component:
   ```typescript
   // components/Button.tsx
   import React from 'react';
   import { TouchableOpacity, Text, StyleSheet } from 'react-native';

   interface ButtonProps {
     title: string;
     onPress: () => void;
   }

   export const Button: React.FC<ButtonProps> = ({ title, onPress }) => (
     <TouchableOpacity style={styles.button} onPress={onPress}>
       <Text style={styles.text}>{title}</Text>
     </TouchableOpacity>
   );

   const styles = StyleSheet.create({
     button: {
       backgroundColor: '#007AFF',
       padding: 16,
       borderRadius: 8,
     },
     text: {
       color: 'white',
       fontSize: 16,
       fontWeight: '600',
     },
   });
   ```

2. Use component:
   ```typescript
   import { Button } from './components/Button';

   <Button title="Press Me" onPress={() => console.log('Pressed')} />
   ```

#### Workflow 2: Navigation Setup

1. Install React Navigation:
   ```bash
   npm install @react-navigation/native @react-navigation/native-stack
   npm install react-native-screens react-native-safe-area-context
   ```

2. Configure:
   ```typescript
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';

   const Stack = createNativeStackNavigator();

   function App() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="Details" component={DetailsScreen} />
         </Stack.Navigator>
       </NavigationContainer>
     );
   }
   ```

## Best Practices

### Do's ✅

- Use TypeScript for type safety
- Implement memo/useMemo/useCallback for performance
- Use FlatList/SectionList for long lists (not ScrollView)
- Test on physical devices, not just simulators
- Use Flipper for debugging
- Implement proper error boundaries

### Don'ts ❌

- Don't use inline styles (use StyleSheet.create)
- Avoid deep component nesting
- Don't put business logic in components
- Never block the JavaScript thread with heavy computations
- Don't forget to add proper loading/error states

## Troubleshooting

### Common Issues

#### Issue 1: Metro Bundler Cache Issues

**Symptoms:**
- Changes not reflecting
- Import errors

**Solution:**
```bash
npm start -- --reset-cache
# or
rm -rf node_modules && npm install
rm -rf ios/Pods && cd ios && pod install && cd ..
```

#### Issue 2: Android Build Failures

**Solution:**
```bash
cd android && ./gradlew clean
cd .. && npx react-native run-android
```

## Related Skills

- [React Native Navigation](../navigation/SKILL.md)
- [iOS Development](../iOS/SKILL.md)
- [Android Development](../Android/SKILL.md)
