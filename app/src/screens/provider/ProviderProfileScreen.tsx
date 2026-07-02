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
import RatingStars from '../../components/RatingStars';

const ProviderProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const profile = user?.providerProfile;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    {
      icon: 'star' as const,
      label: 'Rating',
      value: profile?.rating?.toFixed(1) || '0.0',
      color: '#FFB300',
    },
    {
      icon: 'chatbubble' as const,
      label: 'Reviews',
      value: profile?.totalReviews?.toString() || '0',
      color: colors.info,
    },
    {
      icon: 'briefcase' as const,
      label: 'Experience',
      value: `${profile?.experience || 0}yr`,
      color: colors.success,
    },
    {
      icon: 'cash' as const,
      label: 'Rate',
      value: `₹${profile?.hourlyRate || 0}`,
      color: colors.primary,
    },
  ];

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', onPress: () => {} },
    { icon: 'construct-outline' as const, label: 'My Skills', onPress: () => {} },
    { icon: 'time-outline' as const, label: 'Availability', onPress: () => {} },
    { icon: 'location-outline' as const, label: 'Service Areas', onPress: () => {} },
    { icon: 'notifications-outline' as const, label: 'Notifications', onPress: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => {} },
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
        {profile && (
          <RatingStars
            rating={profile.rating}
            size={16}
            showValue
            totalReviews={profile.totalReviews}
          />
        )}
        <View style={styles.roleBadge}>
          <Ionicons name="construct" size={14} color={colors.accent} />
          <Text style={styles.roleText}>Service Provider</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Bio */}
      {user?.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}

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
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 101, 132, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  avatarText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.accent,
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
    marginBottom: spacing.md,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 101, 132, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  roleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  bioSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bioText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
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

export default ProviderProfileScreen;
