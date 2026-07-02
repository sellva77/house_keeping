import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store';
import { colors } from '../theme';
import { RootStackParamList } from '../types';

import SplashScreen from '../screens/common/SplashScreen';
import AuthStack from './AuthStack';
import HomeownerNavigator from './HomeownerTabs';
import ProviderNavigator from './ProviderTabs';
import ProviderOnboardingScreen from '../screens/auth/ProviderOnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, user, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Check if provider needs onboarding (no categories selected yet)
  const needsOnboarding =
    isAuthenticated &&
    user?.role === 'PROVIDER' &&
    (!user.providerProfile?.categories || user.providerProfile.categories.length === 0);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : needsOnboarding ? (
          <Stack.Screen name="ProviderOnboarding" component={ProviderOnboardingScreen} />
        ) : user?.role === 'PROVIDER' ? (
          <Stack.Screen name="ProviderMain" component={ProviderNavigator} />
        ) : (
          <Stack.Screen name="HomeownerMain" component={HomeownerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
