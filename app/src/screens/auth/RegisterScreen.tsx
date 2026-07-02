import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../../theme';
import { useAuthStore } from '../../store';
import { registerApi } from '../../api';
import { UserRole } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('HOMEOWNER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setAuth = useAuthStore((s) => s.setAuth);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        role,
      });
      await setAuth(user, token);
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the home service marketplace</Text>
          </View>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'HOMEOWNER' && styles.roleBtnActive]}
              onPress={() => setRole('HOMEOWNER')}
            >
              <Ionicons
                name="home"
                size={20}
                color={role === 'HOMEOWNER' ? colors.white : colors.textMuted}
              />
              <Text
                style={[styles.roleText, role === 'HOMEOWNER' && styles.roleTextActive]}
              >
                Homeowner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'PROVIDER' && styles.roleBtnActive]}
              onPress={() => setRole('PROVIDER')}
            >
              <Ionicons
                name="construct"
                size={20}
                color={role === 'PROVIDER' ? colors.white : colors.textMuted}
              />
              <Text
                style={[styles.roleText, role === 'PROVIDER' && styles.roleTextActive]}
              >
                Provider
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((e) => ({ ...e, name: undefined } as any));
              }}
              error={errors.name}
              leftIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined } as any));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
            />

            <Input
              label="Phone (Optional)"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={20} color={colors.textMuted} />}
            />

            <View>
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined } as any));
                }}
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={{ marginTop: spacing.md }}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  roleBtnActive: {
    backgroundColor: colors.primary,
  },
  roleText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  roleTextActive: {
    color: colors.white,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: 38,
    padding: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
});

export default RegisterScreen;
