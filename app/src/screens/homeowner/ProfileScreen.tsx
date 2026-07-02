import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';
import { useAuthStore } from '../../store';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', onPress: () => {} },
    { icon: 'location-outline' as const, label: 'Saved Addresses', onPress: () => {} },
    { icon: 'notifications-outline' as const, label: 'Notifications', onPress: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => {} },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy Policy', onPress: () => {} },
    { icon: 'information-circle-outline' as const, label: 'About', onPress: () => {} },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.phone && <Text style={styles.phone}>{user.phone}</Text>}
        <View style={styles.roleBadge}>
          <Ionicons name="home" size={14} color={colors.primary} />
          <Text style={styles.roleText}>Homeowner</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <Button
        title="Sign Out"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutBtn}
        icon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
      />

      <Text style={styles.version}>HomeServ v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  avatarText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  name: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGhost,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  roleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  logoutBtn: {
    marginBottom: spacing.xl,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },
});

export default ProfileScreen;
