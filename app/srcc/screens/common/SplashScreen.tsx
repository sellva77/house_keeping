import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows } from '../../theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="home" size={56} color={colors.primary} />
        </View>
        <Text style={styles.appName}>HomeServ</Text>
        <Text style={styles.tagline}>Home services, simplified</Text>
      </View>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.glow,
  },
  appName: {
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  loader: {
    position: 'absolute',
    bottom: 80,
  },
});

export default SplashScreen;
