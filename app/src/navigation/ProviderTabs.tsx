import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

import JobRequestsScreen from '../screens/provider/JobRequestsScreen';
import MyJobsScreen from '../screens/provider/MyJobsScreen';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';

const Tab = createBottomTabNavigator();

const ProviderNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Requests')
            iconName = focused ? 'mail' : 'mail-outline';
          else if (route.name === 'My Jobs')
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'Profile')
            iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
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
        name="Requests"
        component={JobRequestsScreen}
        options={{ title: 'Job Requests' }}
      />
      <Tab.Screen
        name="My Jobs"
        component={MyJobsScreen}
        options={{ title: 'My Jobs' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProviderProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default ProviderNavigator;
