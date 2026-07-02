import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithIcon : null, style]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  iconContainer: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
