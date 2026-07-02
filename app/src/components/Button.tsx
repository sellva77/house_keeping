import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.lg,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
      md: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl },
      lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
        ...shadows.glow,
      },
      secondary: {
        backgroundColor: colors.surfaceLight,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.error,
      },
    };

    return {
      ...base,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(isDisabled && { opacity: 0.5 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      sm: { fontSize: typography.sizes.sm },
      md: { fontSize: typography.sizes.md },
      lg: { fontSize: typography.sizes.lg },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: { color: colors.white },
      secondary: { color: colors.text },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
      danger: { color: colors.white },
    };

    return {
      fontWeight: typography.weights.semibold,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), icon ? { marginLeft: spacing.sm } : {}, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
