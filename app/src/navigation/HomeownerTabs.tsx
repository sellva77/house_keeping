import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { HomeownerStackParamList } from '../types';

import HomeScreen from '../screens/homeowner/HomeScreen';
import MyBookingsScreen from '../screens/homeowner/MyBookingsScreen';
import ProfileScreen from '../screens/homeowner/ProfileScreen';
import ServiceListScreen from '../screens/homeowner/ServiceListScreen';
import ProviderDetailScreen from '../screens/homeowner/ProviderDetailScreen';
import BookingFormScreen from '../screens/homeowner/BookingFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<HomeownerStackParamList>();

const HomeownerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: typography.weights.semibold,
          fontSize: typography.sizes.lg,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const HomeownerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: typography.weights.semibold,
          fontSize: typography.sizes.lg,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeownerTabs"
        component={HomeownerTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceList"
        component={ServiceListScreen}
        options={({ route }) => ({
          title: (route.params as any)?.category?.name || 'Providers',
        })}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetailScreen}
        options={({ route }) => ({
          title: (route.params as any)?.providerName || 'Provider',
        })}
      />
      <Stack.Screen
        name="BookingForm"
        component={BookingFormScreen}
        options={{ title: 'Book Service' }}
      />
    </Stack.Navigator>
  );
};

export default HomeownerNavigator;
