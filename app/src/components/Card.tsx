import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' ? styles.elevated : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadows.md,
  },
});

export default Card;
