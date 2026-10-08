import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SizeModal } from '../components/SizeModal';
import { Toast } from '../components/Toast';
import { AppProvider, useApp } from '../context/AppContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { toastMessage } = useApp();

  useEffect(() => {
    // Hide splash screen smoothly after layout setup
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F9F9F8' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="register" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="order-placed" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="search" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
      <SizeModal />
      <Toast message={toastMessage} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
